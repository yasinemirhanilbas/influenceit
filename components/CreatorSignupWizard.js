"use client";

import { startTransition, useActionState, useEffect, useId, useRef, useState } from "react";
import { getMessages, interpolate } from "@/locales";
import { normalizePhone } from "@/lib/phone";
import PhoneField from "@/components/PhoneField";
import TermsText from "@/components/TermsText";
import { creatorSignUpAction } from "@/app/[lang]/auth/actions";
import CreatorServicesStep from "@/components/CreatorServicesStep";
import { normalizePackages } from "@/lib/services";
import {
  ABOUT_MAX, CATEGORIES, CITIES, FOLLOWERS_MAX, GALLERY_MAX, GENDERS, IMAGE_ACCEPT, IMAGE_MAX_BYTES, PLATFORMS, USERNAME_PATTERN,
} from "@/lib/options";

// Creator sign-up: a multi-step form. All steps stay mounted (hidden) so one FormData holds every field and photo.
// Steps live in STEPS; add a step there and a matching <section> below. Error keys map to the step that owns them.
const STEPS = ["basic", "photos", "social", "services"];
const ERROR_STEP = { profileImage: 2, imageType: 2, imageSize: 2, platforms: 3, socialUsername: 3, socialFollowers: 3, services: 4, servicePrice: 4, serviceDetails: 4,
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-field bg-paper px-4 text-base text-ink placeholder:text-ink-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";
const buttonFocus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light";

// Same rules as creatorSignUpAction (the server checks again). Returns an error key or null.
function checkBasic(data, categories) {
  const value = (key) => String(data.get(key) ?? "").trim();
  const password = String(data.get("password") ?? "");
  if (!value("firstName") || !value("lastName")) return "name";
  if (!EMAIL.test(value("email"))) return "email";
  if (!GENDERS.includes(value("gender"))) return "gender";
  if (!normalizePhone(value("phoneCode"), value("phone"))) return "phone";
  if (!CITIES.includes(value("city"))) return "city";
  if (categories.length === 0) return "categories";
  if (value("about").length > ABOUT_MAX) return "about";
  if (password.length < 8) return "password";
  if (password !== String(data.get("passwordConfirm") ?? "")) return "passwordMatch";
  if (data.get("terms") !== "on") return "terms";
  return null;
}

function checkPhotos(data) {
  const profile = data.get("profileImage");
  if (!(profile instanceof File) || profile.size === 0) return "profileImage";
  return null;
}

// Returns an error key (and the platform it is about) or null.
function checkSocial(data, platforms) {
  if (platforms.length === 0) return { error: "platforms" };
  for (const id of platforms) {
    const username = String(data.get(`${id}_username`) ?? "").trim().replace(/^@/, "");
    const followers = String(data.get(`${id}_followers`) ?? "").trim();
    if (!USERNAME_PATTERN.test(username)) return { error: "socialUsername", platform: id };
    if (!/^\d{1,10}$/.test(followers) || Number(followers) > FOLLOWERS_MAX) return { error: "socialFollowers", platform: id };
  }
  return null;
}

// Small hand-drawn glyphs for the platform buttons.
function PlatformIcon({ id, className = "h-7 w-7" }) {
  const common = { "aria-hidden": "true", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", className };
  if (id === "instagram")
    return (
      <svg {...common}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17" cy="7" r="0.6" fill="currentColor" />
      </svg>
    );
  if (id === "tiktok")
    return (
      <svg {...common}>
        <path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5" />
        <path d="M14 4c.4 2.4 2 3.9 4.5 4.1" />
      </svg>
    );
  if (id === "youtube")
    return (
      <svg {...common}>
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor" />
      </svg>
    );
  if (id === "kick")
    return (
      <svg {...common}>
        <path d="M7 4.5v15M7 12l8-7.5M10.5 10 17 19.5" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M5 4.5 19 19.5M19 4.5 5 19.5" />
    </svg>
  );
}

function PhotoSlot({ name, label, required, copy, onError }) {
  const inputRef = useRef(null);
  const inputId = useId();
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function clear() {
    if (inputRef.current) inputRef.current.value = "";
    setPreviewUrl(null);
  }

  function handleChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    if (!IMAGE_ACCEPT.split(",").includes(file.type)) {
      clear();
      onError("imageType");
      return;
    }
    if (file.size > IMAGE_MAX_BYTES) {
      clear();
      onError("imageSize");
      return;
    }
    onError(null);
    setPreviewUrl(URL.createObjectURL(file));
  }

  return (
    <div>
      <p className="text-sm font-semibold">
        {label}
        {required ? <span aria-hidden="true" className="text-brand"> *</span> : null}
      </p>
      <div className="relative mt-2">
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="file"
          accept={IMAGE_ACCEPT}
          onChange={handleChange}
          aria-required={required || undefined}
          className="peer sr-only"
        />
        <label
          htmlFor={inputId}
          className="flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-paper text-center text-sm font-semibold text-ink-soft transition hover:border-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-light"
        >
          {previewUrl ? (
            // A local blob preview of the chosen file; next/image cannot optimise it.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt={copy.photoAlt} className="h-full w-full object-cover" />
          ) : (
            <span className="px-3">{copy.choosePhoto}</span>
          )}
        </label>
      </div>
      {previewUrl ? (
        <button
          type="button"
          onClick={clear}
          className={`mt-2 text-sm font-semibold text-brand underline underline-offset-4 hover:text-brand-dark ${buttonFocus}`}
        >
          {copy.removePhoto}
        </button>
      ) : null}
    </div>
  );
}

export default function CreatorSignupWizard({ lang }) {
  const { signup, featured, profile } = getMessages(lang);
  const copy = signup.creator;
  const formRef = useRef(null);
  const [step, setStep] = useState(1);
  const [error, setError] = useState(null);
  const [picked, setPicked] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [activePlatform, setActivePlatform] = useState(null);
  const [packages, setPackages] = useState([]);
  const [servicePlatform, setServicePlatform] = useState(null);
  const [state, formAction, pending] = useActionState(creatorSignUpAction, null);
  const [seenState, setSeenState] = useState(null);

  // A new answer from the server: show its error and jump to the step that owns it.
  if (state !== seenState) {
    setSeenState(state);
    if (state?.error) {
      setError(state.error);
      setStep(ERROR_STEP[state.error] ?? 1);
    }
  }

  const label = (id) => featured.niches[id] ?? id;
  // All 81 provinces, alphabetical in the page language (Turkish letters sort correctly with the "tr" locale).
  const sortedCities = [...CITIES].sort((a, b) => profile.cities[a].localeCompare(profile.cities[b], lang));
  const errorMessage = error ? interpolate(signup.errors[error] ?? signup.errors.generic, { max: ABOUT_MAX }) : null;

  function toggleCategory(id) {
    setPicked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function togglePlatform(id) {
    if (platforms.includes(id)) {
      const rest = platforms.filter((item) => item !== id);
      setPlatforms(rest);
      // Packages of a platform that is no longer listed would be rejected, so drop them with it.
      setPackages((current) => current.filter((pkg) => pkg.platform !== id));
      if (activePlatform === id) setActivePlatform(rest[0] ?? null);
    } else {
      setPlatforms([...platforms, id]);
      setActivePlatform(id);
    }
  }

  function goTo(next) {
    setError(null);
    setStep(next);
    formRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(formRef.current);
    // Check every step up to the current one, so nobody moves on (or submits) with an earlier step incomplete.
    const checks = [
      () => checkBasic(data, picked),
      () => checkPhotos(data),
      () => checkSocial(data, platforms),
      () => normalizePackages(packages, platforms),
    ];
    for (let index = 0; index < Math.min(step, checks.length); index += 1) {
      const result = checks[index]();
      const key = typeof result === "string" ? result : result?.error;
      if (key) {
        setError(key);
        if (result?.platform) {
          setActivePlatform(result.platform);
          setServicePlatform(result.platform);
        }
        setStep(index + 1);
        return;
      }
    }
    if (step < STEPS.length) {
      goTo(step + 1);
      return;
    }
    setError(null);
    // Calling the action ourselves (not through <form action>) keeps typed values and photos after a server error.
    startTransition(() => formAction(data));
  }

  const isLast = step === STEPS.length;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="rounded-card border border-line bg-card p-6 shadow-card sm:p-8">
      <input type="hidden" name="lang" value={lang} />
      {picked.map((id) => (
        <input key={id} type="hidden" name="categories" value={id} />
      ))}
      {platforms.map((id) => (
        <input key={id} type="hidden" name="platforms" value={id} />
      ))}
      <input
        type="hidden"
        name="packages"
        value={JSON.stringify(packages.map(({ key, ...pkg }) => pkg))}
      />

      <nav aria-label={interpolate(copy.stepOf, { current: step, total: STEPS.length })}>
        <ol className="flex items-center gap-2">
          {STEPS.map((id, index) => {
            const number = index + 1;
            const active = number === step;
            const done = number < step;
            return (
              <li key={id} aria-current={active ? "step" : undefined} className={`flex items-center gap-2 ${number < STEPS.length ? "flex-1" : ""}`}>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
                    active || done ? "bg-brand-gradient border-transparent text-white" : "border-line bg-paper text-ink-soft"
                  }`}
                >
                  {number}
                </span>
                {/* Only the current step shows its name; the others stay as numbers so four steps fit on a phone. */}
                <span className={active ? "text-sm font-semibold text-ink" : "sr-only"}>{copy.steps[id]}</span>
                {number < STEPS.length ? <span aria-hidden="true" className="h-px min-w-3 flex-1 bg-line" /> : null}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step 1: basic info */}
      <section hidden={step !== 1} className="mt-6 space-y-5">
        <div>
          <h2 className="font-display text-xl font-semibold">{copy.basicTitle}</h2>
          <p className="mt-1 text-sm text-ink-soft">{copy.basicText}</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">{signup.firstName}</span>
            <input name="firstName" type="text" autoComplete="given-name" maxLength={40} aria-required="true" className={inputClass} />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{signup.lastName}</span>
            <input name="lastName" type="text" autoComplete="family-name" maxLength={40} aria-required="true" className={inputClass} />
          </label>
        </div>
        <label className="block">
          <span className="text-sm font-semibold">{signup.email}</span>
          <input name="email" type="email" autoComplete="email" aria-required="true" className={inputClass} />
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">{signup.city}</span>
            <select name="city" defaultValue="" aria-required="true" className={inputClass}>
              <option value="" disabled>{signup.cityPlaceholder}</option>
              {sortedCities.map((city) => (
                <option key={city} value={city}>{profile.cities[city]}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{copy.gender}</span>
            <select name="gender" defaultValue="" aria-required="true" className={inputClass}>
              <option value="" disabled>{copy.genderPlaceholder}</option>
              {GENDERS.map((gender) => (
                <option key={gender} value={gender}>{copy.genders[gender]}</option>
              ))}
            </select>
          </label>
        </div>
        <PhoneField copy={{ label: copy.phone, hint: copy.phoneHint, code: copy.phoneCode, digits: copy.phoneDigits }} />

        <fieldset>
          <legend className="text-sm font-semibold">
            {copy.categories}
            <span aria-hidden="true" className="text-brand"> *</span>
          </legend>
          <p className="mt-1 text-sm text-ink-soft" aria-live="polite">
            {interpolate(copy.categoriesHint, { count: picked.length })}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {CATEGORIES.map((id) => {
              const active = picked.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleCategory(id)}
                  className={`min-h-11 rounded-xl border px-2 py-2 text-sm font-semibold transition ${buttonFocus} ${
                    active ? "border-brand bg-brand-soft text-brand-dark" : "border-line bg-paper text-ink-soft hover:border-brand"
                  }`}
                >
                  {label(id)}
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-sm font-semibold">{copy.about}</span>
          <textarea
            name="about"
            rows={6}
            maxLength={ABOUT_MAX}
            placeholder={interpolate(copy.aboutPlaceholder, { max: ABOUT_MAX })}
            className={`${inputClass} min-h-36 py-3`}
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold">{signup.passwordLabel}</span>
            <input name="password" type="password" autoComplete="new-password" aria-required="true" className={inputClass} />
            <span className="mt-1 block text-sm text-ink-soft">{signup.passwordHint}</span>
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{copy.passwordConfirm}</span>
            <input name="passwordConfirm" type="password" autoComplete="new-password" aria-required="true" className={inputClass} />
          </label>
        </div>
        <label className="flex items-start gap-3">
          <input name="terms" type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[#7a2742]" />
          <span className="text-ink-soft">
            <TermsText lang={lang} />
          </span>
        </label>
      </section>

      {/* Step 2: photos */}
      <section hidden={step !== 2} className="mt-6 space-y-5">
        <div>
          <h2 className="font-display text-xl font-semibold">{copy.photosTitle}</h2>
          <p className="mt-1 text-sm text-ink-soft">{copy.photosText}</p>
        </div>
        <div className="max-w-48">
          <PhotoSlot name="profileImage" label={copy.profilePhoto} required copy={copy} onError={setError} />
        </div>
        <div>
          <p className="text-sm font-semibold">{copy.galleryLabel}</p>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {Array.from({ length: GALLERY_MAX }, (_, index) => (
              <PhotoSlot key={index} name="gallery" label={`${copy.galleryLabel} ${index + 1}`} copy={copy} onError={setError} />
            ))}
          </div>
        </div>
        <p className="text-sm text-ink-soft">{copy.photoHint}</p>
      </section>

      {/* Step 3: social accounts. Every picked platform keeps its inputs mounted so values survive tab changes. */}
      <section hidden={step !== 3} className="mt-6 space-y-5">
        <div>
          <h2 className="font-display text-xl font-semibold">{copy.socialTitle}</h2>
          <p className="mt-1 text-sm text-ink-soft">{copy.socialText}</p>
        </div>
        <fieldset>
          <legend className="text-sm font-semibold">
            {copy.platformsLabel}
            <span aria-hidden="true" className="text-brand"> *</span>
          </legend>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {PLATFORMS.map((id) => {
              const on = platforms.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => togglePlatform(id)}
                  className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border p-3 text-sm font-semibold transition ${buttonFocus} ${
                    on ? "border-brand bg-brand-soft text-brand-dark" : "border-line bg-paper text-ink-soft hover:border-brand"
                  }`}
                >
                  <PlatformIcon id={id} />
                  {copy.platforms[id]}
                </button>
              );
            })}
          </div>
        </fieldset>

        {platforms.length > 0 ? (
          <div>
            <div role="tablist" aria-label={copy.platformsLabel} className="flex flex-wrap gap-2">
              {platforms.map((id) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={activePlatform === id}
                  onClick={() => setActivePlatform(id)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${buttonFocus} ${
                    activePlatform === id ? "bg-brand-gradient border-transparent text-white" : "border-line bg-paper text-ink-soft hover:border-brand"
                  }`}
                >
                  <PlatformIcon id={id} className="h-4 w-4" />
                  {copy.platforms[id]}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {platforms.map((id) => (
          <div key={id} role="tabpanel" hidden={activePlatform !== id} className="space-y-5 rounded-xl border border-line bg-paper p-5">
            <p className="flex items-center gap-2 font-display font-semibold">
              <PlatformIcon id={id} className="h-5 w-5" />
              {copy.platforms[id]}
            </p>
            <label className="block">
              <span className="text-sm font-semibold">{interpolate(copy.usernameLabel, { platform: copy.platforms[id] })}</span>
              <input name={`${id}_username`} type="text" autoComplete="off" maxLength={31} aria-required="true" className={inputClass} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">{copy.followersLabel}</span>
              <input
                name={`${id}_followers`}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={10}
                placeholder={copy.followersPlaceholder}
                aria-required="true"
                className={inputClass}
              />
              <span className="mt-1 block text-sm text-ink-soft">{copy.followersHint}</span>
            </label>
          </div>
        ))}
      </section>

      {/* Step 4: services and prices */}
      <section hidden={step !== 4} className="mt-6">
        <CreatorServicesStep
          copy={copy}
          platforms={platforms}
          packages={packages}
          setPackages={setPackages}
          activePlatform={servicePlatform}
          setActivePlatform={setServicePlatform}
          PlatformIcon={PlatformIcon}
        />
      </section>

      {errorMessage ? (
        <p role="alert" className="mt-6 rounded-xl border border-brand-light bg-brand-soft p-4 text-sm text-brand-dark">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-6 flex items-center justify-between gap-3">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => goTo(step - 1)}
            className={`min-h-12 rounded-full border border-line bg-paper px-6 font-semibold transition hover:border-brand ${buttonFocus}`}
          >
            {copy.back}
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={pending}
          className={`bg-brand-gradient min-h-12 rounded-full px-7 font-semibold text-white shadow-glow transition hover:brightness-110 active:translate-y-0.5 disabled:opacity-60 ${buttonFocus}`}
        >
          {pending ? signup.submitting : isLast ? signup.submit : copy.next}
        </button>
      </div>
      <p className="mt-4 text-center text-sm text-ink-soft">{signup.note}</p>
    </form>
  );
}
