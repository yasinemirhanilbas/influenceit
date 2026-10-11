"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { db } from "@/lib/db";
import {
  APPLICATION_DECISIONS,
  APPLY_MESSAGE_MAX,
  APPLY_MESSAGE_MIN,
  JOB_BUDGET_MAX,
  JOB_BUDGET_MIN,
  JOB_DAYS_MAX,
  JOB_FORMATS,
  JOB_SUMMARY_MAX,
  JOB_TITLE_MAX,
  NICHES,
} from "@/lib/options";
import { ORDER_STATUS } from "@/lib/orderStatus";
import { getRoutes } from "@/lib/routes";
import { getSessionUser } from "@/lib/session";
import { isLocale } from "@/locales";

// Server actions for job postings (brands) and applications (creators).
// They return { error: "<key>" } on failure; the forms translate the key with locales (jobForm.errors / jobDetail.errors).

const text = (formData, key) => String(formData.get(key) ?? "").trim();

function safeLang(formData) {
  const lang = text(formData, "lang");
  return isLocale(lang) ? lang : "en";
}

// Whole numbers only: "1500" is fine, "15.5" and "1e3" are not.
function wholeNumber(value) {
  return /^\d{1,9}$/.test(value) ? Number(value) : null;
}

export async function createJobAction(_previous, formData) {
  const lang = safeLang(formData);
  const user = await getSessionUser();
  if (!user?.brandProfile) return { error: "notBrand" };

  const title = text(formData, "title");
  const summary = text(formData, "summary");
  const niche = text(formData, "niche");
  const format = text(formData, "format");
  // Optional version in the other site language (Turkish on the English page, English on the Turkish page).
  const titleOther = text(formData, "titleOther");
  const summaryOther = text(formData, "summaryOther");
  const budget = wholeNumber(text(formData, "budget"));
  const days = wholeNumber(text(formData, "days"));

  if (!title || title.length > JOB_TITLE_MAX) return { error: "title" };
  if (!summary || summary.length > JOB_SUMMARY_MAX) return { error: "summary" };
  if (titleOther || summaryOther) {
    // Both fields or none, with the same limits as the main text.
    if (!titleOther || titleOther.length > JOB_TITLE_MAX || !summaryOther || summaryOther.length > JOB_SUMMARY_MAX) {
      return { error: "other" };
    }
  }
  if (!NICHES.includes(niche)) return { error: "niche" };
  if (!JOB_FORMATS.includes(format)) return { error: "format" };
  if (budget === null || budget < JOB_BUDGET_MIN || budget > JOB_BUDGET_MAX) return { error: "budget" };
  if (days === null || days < 1 || days > JOB_DAYS_MAX) return { error: "days" };

  const job = await db.job.create({
    data: {
      brandId: user.brandProfile.id,
      // `title`/`summary` are the default text (English column); `titleTr`/`summaryTr` are shown on the Turkish pages.
      // Text typed on the Turkish page goes to the Turkish columns; the English columns get the other version, or the same text.
      title: lang === "tr" ? titleOther || title : title,
      summary: lang === "tr" ? summaryOther || summary : summary,
      titleTr: lang === "tr" ? title : titleOther || null,
      summaryTr: lang === "tr" ? summary : summaryOther || null,
      niche,
      format,
      budgetAmount: budget,
      budgetCurrency: "TRY",
      deliveryDays: days,
    },
  });
  updateTag("jobs");
  redirect(`${getRoutes(lang).job(job.id)}?posted=1`);
}

export async function applyAction(_previous, formData) {
  const lang = safeLang(formData);
  const user = await getSessionUser();
  if (!user?.creatorProfile) return { error: "notCreator" };

  const jobId = wholeNumber(text(formData, "jobId"));
  const message = text(formData, "message");
  if (message.length < APPLY_MESSAGE_MIN || message.length > APPLY_MESSAGE_MAX) return { error: "message" };

  const job = jobId === null ? null : await db.job.findUnique({ where: { id: jobId } });
  if (!job) return { error: "notFound" };
  if (job.status !== "OPEN") return { error: "closed" };

  try {
    await db.application.create({ data: { jobId: job.id, creatorId: user.creatorProfile.id, message } });
  } catch (error) {
    // The unique index on [jobId, creatorId] also catches two clicks at the same moment.
    if (error?.code === "P2002") return { error: "alreadyApplied" };
    throw error;
  }
  updateTag("jobs");
  redirect(`${getRoutes(lang).job(job.id)}?applied=1`);
}

// Brand actions on its own jobs. They are plain form actions: they change nothing when the job does not belong to
// the logged-in brand, and always go back to the account page.
async function ownedJob(formData) {
  const user = await getSessionUser();
  const jobId = wholeNumber(text(formData, "jobId"));
  if (!user?.brandProfile || jobId === null) return null;
  const job = await db.job.findUnique({ where: { id: jobId } });
  return job && job.brandId === user.brandProfile.id ? job : null;
}

export async function setJobStatusAction(formData) {
  const lang = safeLang(formData);
  const status = text(formData, "status");
  const job = await ownedJob(formData);
  if (job && (status === "OPEN" || status === "CLOSED")) {
    await db.job.update({ where: { id: job.id }, data: { status } });
    updateTag("jobs");
  }
  redirect(getRoutes(lang).account);
}

// accept = choose the creator: the job closes and an order is created from the job (price and brief come from
// the job), waiting for the brand's payment. reject = decline, reset = back to pending.
// Once the order is paid the choice is final: it can no longer be undone or changed here.
export async function decideApplicationAction(formData) {
  const lang = safeLang(formData);
  const decision = APPLICATION_DECISIONS[text(formData, "decision")];
  const applicationId = wholeNumber(text(formData, "applicationId"));
  const user = await getSessionUser();
  if (user?.brandProfile && decision && applicationId !== null) {
    const application = await db.application.findUnique({ where: { id: applicationId }, include: { job: true } });
    if (application && application.job.brandId === user.brandProfile.id) {
      const { job } = application;
      await db.$transaction(async (tx) => {
        const order = await tx.order.findUnique({ where: { jobId: job.id } });
        if (order && order.status !== ORDER_STATUS.PENDING) return; // already paid: final
        if (decision === "ACCEPTED") {
          if (order) return; // a creator is already chosen for this job
          await tx.application.update({ where: { id: application.id }, data: { status: "ACCEPTED" } });
          await tx.job.update({ where: { id: job.id }, data: { status: "CLOSED" } });
          await tx.order.create({
            data: {
              brandId: job.brandId,
              creatorId: application.creatorId,
              jobId: job.id,
              brief: job.summary,
              status: ORDER_STATUS.PENDING,
              packageName: job.title,
              priceAmount: job.budgetAmount,
              priceCurrency: job.budgetCurrency,
            },
          });
          return;
        }
        // reject / reset: an unpaid order made by an earlier "choose" is removed, only for the chosen creator
        if (order && order.creatorId === application.creatorId) await tx.order.delete({ where: { id: order.id } });
        if (order && order.creatorId !== application.creatorId) return;
        await tx.application.update({ where: { id: application.id }, data: { status: decision } });
      });
      updateTag("jobs");
    }
  }
  redirect(getRoutes(lang).account);
}
