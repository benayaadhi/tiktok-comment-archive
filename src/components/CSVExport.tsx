
import { Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  username: string;
  nickname: string;
  comment: string;
  timestamp: Date;
}

interface CSVExportProps {
  comments: Comment[];
  targetUsername: string;
}

export const CSVExport = ({ comments, targetUsername }: CSVExportProps) => {
  const { toast } = useToast();

  const downloadCSV = () => {
    if (comments.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no comments to download yet.",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Timestamp", "Username", "Nickname", "Comment"];
    const csvContent = [
      headers.join(","),
      ...comments.map(comment => [
        `"${comment.timestamp.toISOString()}"`,
        `"${comment.username}"`,
        `"${comment.nickname}"`,
        `"${comment.comment.replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `tiktok_comments_${targetUsername}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "CSV Downloaded!",
      description: `Successfully exported ${comments.length} comments to CSV.`,
    });
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-900/30 to-indigo-800/30 border-indigo-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-indigo-500/20 rounded-lg">
            <FileSpreadsheet className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Export Data</h3>
            <p className="text-sm text-indigo-300">
              Download {comments.length} comments as CSV
            </p>
          </div>
        </div>
        <Button
          onClick={downloadCSV}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0"
          disabled={comments.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Download CSV
        </Button>
      </div>
    </Card>
  );
};
