import React from "react";

export function OpenAIIcon({ className = "w-6 h-6", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.259 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7466-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4947zm-9.66-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1402-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.4992 4.4992 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.5973 8.3829l2.02-1.1636a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.402-.6862zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L8.907 9.2298V6.8974a.0662.0662 0 0 1 .0331-.0615l4.8304-2.7866a4.4992 4.4992 0 0 1 6.6803 4.6857zM11.806 13.064l-2.6072-1.5046 2.6072-1.5046 2.6072 1.5046-2.6072 1.5046z"
        fill={color}
      />
    </svg>
  );
}

export function AnthropicIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center rounded-xl bg-[#F06543] text-white font-bold select-none ${className}`}>
      <span className="text-[13px] tracking-tight font-black font-sans leading-none">AI</span>
    </div>
  );
}

export function AnthropicTextLogo({ className = "h-5" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-5 h-5 rounded-md bg-[#191919] dark:bg-white text-white dark:text-black font-black flex items-center justify-center text-xs">
        A
      </div>
      <span className="font-bold tracking-tight text-zinc-900 dark:text-white text-sm">Anthropic</span>
    </div>
  );
}

export function MetaIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 15.696c-1.378 0-2.482-.962-3.13-2.02l-1.34-2.185C6.73 10.15 5.56 9.4 4.295 9.4c-2.316 0-4.195 1.83-4.195 4.09 0 2.26 1.879 4.09 4.195 4.09 1.487 0 2.812-.767 3.655-2.003l1.155-1.745c.677-.96 1.636-1.536 2.89-1.536s2.213.576 2.89 1.536l1.155 1.745c.843 1.236 2.168 2.003 3.655 2.003 2.316 0 4.195-1.83 4.195-4.09 0-2.26-1.879-4.09-4.195-4.09-1.265 0-2.435.75-3.235 2.09l-1.34 2.186c-.648 1.058-1.752 2.02-3.13 2.02z"
        fill="url(#meta-gradient)"
      />
      <path
        d="M19.705 6.8C16.89 6.8 14.54 8.54 13.43 11.02c-.52-.77-1.19-1.42-1.95-1.92-1.12-2.32-3.44-3.9-6.185-3.9C2.37 5.2 0 7.51 0 10.49c0 2.98 2.37 5.39 5.295 5.39 2.745 0 5.065-1.58 6.185-3.9.76.5 1.43 1.15 1.95 1.92 1.11-2.48 3.46-4.22 6.275-4.22 3.125 0 5.295 2.41 5.295 5.39 0 2.98-2.17 5.39-5.295 5.39-1.76 0-3.32-.87-4.27-2.22l-.99-1.49c-.58-.87-1.48-1.43-2.45-1.43s-1.87.56-2.45 1.43l-.99 1.49C8.91 19.53 7.35 20.4 5.59 20.4 2.465 20.4 0 18.09 0 15.11"
        fill="url(#meta-gradient)"
        opacity="0"
      />
      <defs>
        <linearGradient id="meta-gradient" x1="0" y1="9.4" x2="24" y2="17.58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0064E0" />
          <stop offset="0.5" stopColor="#0079FF" />
          <stop offset="1" stopColor="#0082FB" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GoogleGIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function MistralIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Mistral stepped M shape */}
      <rect x="2" y="4" width="4" height="4" fill="#FF5E00" />
      <rect x="18" y="4" width="4" height="4" fill="#FF5E00" />
      <rect x="2" y="8" width="8" height="4" fill="#FF5E00" />
      <rect x="14" y="8" width="8" height="4" fill="#FF5E00" />
      <rect x="2" y="12" width="20" height="4" fill="#FF7000" />
      <rect x="2" y="16" width="6" height="4" fill="#FF8400" />
      <rect x="10" y="16" width="4" height="4" fill="#FF8400" />
      <rect x="16" y="16" width="6" height="4" fill="#FF8400" />
    </svg>
  );
}

export function GeminiIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center font-sans font-semibold tracking-tight text-[#1A73E8] dark:text-[#4285F4] ${className}`}>
      <span className="text-[14px] font-bold bg-gradient-to-r from-[#1A73E8] via-[#7B1FA2] to-[#1A73E8] bg-clip-text text-transparent">Gemini</span>
    </div>
  );
}

export function XAIIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DeepSeekIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.5 12c0 4.5-3.5 8-8 8-2.2 0-4.2-.9-5.7-2.3L4.2 19c-.4.4-1.1.1-1.1-.5v-4.5c0-.3.1-.6.3-.8C2.5 12.1 2 10.6 2 9c0-4.4 3.6-8 8-8 3.5 0 6.5 2.2 7.6 5.3 2.3.9 3.9 3.1 3.9 5.7z"
        fill="#1E88E5"
      />
      <circle cx="8" cy="8" r="1.5" fill="white" />
      <path
        d="M18.5 11.5c-1-1.5-2.8-2.5-4.8-2.5-1.2 0-2.3.4-3.2 1"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M19 15c-1.5 1.5-3.5 2.5-6 2.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HuggingFaceIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center select-none text-xl leading-none ${className}`}>
      🤗
    </div>
  );
}

export function PerplexityIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2L4 7V17L12 22L20 17V7L12 2Z"
        stroke="#20B2AA"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 2V22" stroke="#20B2AA" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 7L20 17" stroke="#20B2AA" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 7L4 17" stroke="#20B2AA" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function TrustpilotStar({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <div className="flex items-center justify-center w-4 h-4 rounded-sm bg-[#00B67A] text-white">
      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    </div>
  );
}
