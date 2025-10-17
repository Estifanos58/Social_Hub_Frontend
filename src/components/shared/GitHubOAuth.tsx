import { FaGithub } from "react-icons/fa";

const handleGitHubOAuth = () => {
  console.log('GitHub OAuth initiated', process.env.NEXT_PUBLIC_API_BASE_URL+ '/auth/github');
  window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/github`;
};

function GitHubOAuth() {
  return (
    <button
      type="button"
      onClick={handleGitHubOAuth}
      className="flex w-full h-15 items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-slate-300/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-slate-900">
        <FaGithub size={22} />
      </span>
      <span className="hidden sm:inline">GitHub</span>
      <span className="sm:hidden">GitHub</span>
    </button>
  );
}

export default GitHubOAuth;
