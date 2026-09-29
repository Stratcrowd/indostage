import { whatsappLink } from "@/lib/site";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("Hi IndoStage! I'd like to know more.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with IndoStage on WhatsApp"
      className="group fixed right-5 bottom-5 z-40 flex items-center gap-2 rounded-full bg-[#1faa53] p-3.5 text-white shadow-[0_12px_40px_-8px_rgba(31,170,83,0.6)] transition hover:scale-105 sm:right-7 sm:bottom-7"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35ZM12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.56.93.95-3.47-.22-.36A9.43 9.43 0 1 1 12.05 21.5Zm8.02-17.45A11.27 11.27 0 0 0 2.33 17.64L.73 23.5l6-1.57a11.25 11.25 0 0 0 5.38 1.37h.01A11.28 11.28 0 0 0 20.07 4.05Z" />
      </svg>
      <span className="hidden pr-1 text-sm font-semibold sm:group-hover:inline">
        Chat with us
      </span>
    </a>
  );
}
