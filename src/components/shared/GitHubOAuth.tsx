import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";

const handleGitHubOAuth = () => {
  console.log('GitHub OAuth initiated', process.env.NEXT_PUBLIC_API_BASE_URL+ '/auth/github');
  window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/github`;
};

function GitHubOAuth() {
  return (
    <Button
      onClick={handleGitHubOAuth}
      variant="outline"
      className="flex-1"
    >
      <FaGithub size={22} />
    </Button>
  );
}

export default GitHubOAuth;
