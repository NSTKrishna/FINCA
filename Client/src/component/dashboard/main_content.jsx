import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  FileText,
  Upload,
  Download,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  HardDrive,
  Sparkles,
  PieChart,
  BarChart3
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const MainContent = () => {
  const { user, getAuthHeaders } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [latestAnalysis, setLatestAnalysis] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://finca.onrender.com/api/upload/user-documents", {
          headers: getAuthHeaders(),
          withCredentials: true,
        });

        if (response.data.success) {
          const docs = response.data.data;
          setDocuments(docs);

          // Find latest document with analysis
          const analyzedDoc = docs.find(d => d.analysis);
          if (analyzedDoc) {
            setLatestAnalysis({
              ...analyzedDoc.analysis,
              fileName: analyzedDoc.fileName,
              date: analyzedDoc.uploadedAt
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // derived metrics
  const totalDocs = documents.length;
  const analyzedDocs = documents.filter(d => d.analysis).length;
  const totalSize = documents.reduce((acc, curr) => acc + curr.size, 0);

  const metrics = [
    {
      title: "Total Documents",
      value: totalDocs.toString(),
      icon: FileText,
      description: "uploaded files",
      color: "text-blue-500",
    },
    {
      title: "Analyzed Reports",
      value: analyzedDocs.toString(),
      icon: Sparkles,
      description: "processed by AI",
      color: "text-purple-500",
    },
    {
      title: "Storage Used",
      value: formatSize(totalSize),
      icon: HardDrive,
      description: "cloud storage",
      color: "text-orange-500",
    },
    {
      title: "Latest Activity",
      value: documents.length > 0 ? new Date(documents[0].uploadedAt).toLocaleDateString() : "-",
      icon: Clock,
      description: "last upload",
      color: "text-green-500",
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Overview of your financial documents and AI insights.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <Calendar className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
          <Button size="sm" asChild>
            <a href="/upload">
              <Upload className="mr-2 h-4 w-4" />
              Upload New
            </a>
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="border-l-4 border-l-primary/20 hover:border-l-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-4 w-4 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Latest AI Analysis Section */}
      {latestAnalysis ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Latest Strategic Insights
            <Badge variant="outline" className="ml-2 font-normal text-muted-foreground">
              from {latestAnalysis.fileName}
            </Badge>
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Executive Summary Card */}
            <Card className="col-span-4 bg-gradient-to-br from-card to-primary/5 border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  Executive Summary
                </CardTitle>
                <CardDescription>AI-generated overview of the document</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-muted-foreground">
                  {latestAnalysis.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {latestAnalysis.topics?.map((topic, i) => (
                    <Badge key={i} variant="secondary">{topic}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Figures Card */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Key Figures
                </CardTitle>
                <CardDescription>Extracted financial metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {latestAnalysis.key_figures && latestAnalysis.key_figures.length > 0 ? (
                    latestAnalysis.key_figures.slice(0, 5).map((fig, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/40 text-sm">
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500 shrink-0" />
                        <span className="font-medium">{fig}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground italic">No key figures detected.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Sparkles className="h-10 w-10 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-semibold">No Analysis Available Yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-4">
              Upload a financial document and click "Analyze" in the Reports section to see AI-powered insights here.
            </p>
            <Button variant="outline" asChild>
              <a href="/upload">Upload Document</a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity / Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
          <CardDescription>
            Your latest uploaded files and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No documents found.</div>
          ) : (
            <div className="space-y-4">
              {documents.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {doc.analysis ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{doc.fileName}</p>
                      <p className="text-xs text-muted-foreground uppercase">
                        {doc.fileName.split('.').pop()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm text-muted-foreground">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatSize(doc.size)}
                      </p>
                    </div>
                    {doc.analysis ? (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Analyzed</Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50">Pending</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MainContent;
