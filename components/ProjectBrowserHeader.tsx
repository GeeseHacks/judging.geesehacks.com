import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface ProjectBrowserHeaderProps {
  currentTab: "all" | "investments";
  hideTabs?: boolean;
}

const ProjectBrowserHeader: React.FC<ProjectBrowserHeaderProps> = ({
  currentTab,
  hideTabs = false,
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchBalance = async () => {
      if (!session?.user?.id) {
        setError("Judge ID not available");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/judge/balance?judgeId=${session.user.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch balance");
        }
        const data = await response.json();
        setBalance(data.balance);
      } catch (err: any) {
        setError(err.message || "Failed to fetch balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [session]);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center space-x-4">
            <Image
              src="/static/icons/stock-market-title.png"
              alt="Stock Market Title Image"
              width={35}
              height={35}
            />
            <h1 className="text-3xl md:text-4xl font-semibold">
              Project Browser
            </h1>
          </div>
          <p className="pb-2 text-md md:text-lg pt-3 text-gray-500">
            Submit investments to projects here
          </p>
        </div>

        <div className="bg-[#3E2B65] px-6 py-3 rounded-xl shadow-lg border border-[#D175FA]/30">
          <div className="text-gray-400 text-sm mb-1">Available Balance</div>
          {loading ? (
            <div className="text-xl font-bold text-[#D175FA]">Loading...</div>
          ) : error ? (
            <div className="text-xl font-bold text-[#D175FA]">Error</div>
          ) : balance !== null ? (
            <div className="text-xl font-bold text-[#D175FA]">
              ${Number(balance).toLocaleString()}
            </div>
          ) : (
            <div className="text-xl font-bold text-[#D175FA]">---</div>
          )}
        </div>
      </div>

      {!hideTabs && (
        <div className="flex space-x-4 pt-5 text-lg font-semibold">
          <button
            onClick={() => router.push("/dashboard/project-browser")}
            className={`${
              currentTab === "all" ? "text-[#D175FA] bg-[#3E2B65]" : "text-white"
            } px-4 py-2 rounded-lg hover:text-[#D175FA] hover:bg-[#3E2B65]`}
          >
            All Projects
          </button>
          <button
            onClick={() =>
              router.push("/dashboard/project-browser/my-investments")
            }
            className={`${
              currentTab === "investments"
                ? "text-[#D175FA] bg-[#3E2B65]"
                : "text-white"
            } px-4 py-2 rounded-lg hover:text-[#D175FA] hover:bg-[#3E2B65]`}
          >
            My Investments
          </button>
        </div>
      )}
    </>
  );
};

export default ProjectBrowserHeader;
