import { useState, useEffect } from "react";
import Navigation from "../component/layout/navbar";
import { useAuth } from "../context/AuthContext";
import { FileText, Download, Calendar, HardDrive, Loader2, AlertCircle, Trash2, Sparkles, CheckCircle2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import axios from "axios";

function ReportPage() {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const { getAuthHeaders } = useAuth();

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get("https://finca.onrender.com/api/upload/user-documents", {
                headers: getAuthHeaders(),
                withCredentials: true,
            });

            if (response.data.success) {
                setDocuments(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching documents:", err);
            setError("Failed to load documents.");
        } finally {
            setIsLoading(false);
        }
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const verifyFile = (file) => {
        // Placeholder for view action - could open in new tab
        if (file.fileUrl) {
            window.open(file.fileUrl, "_blank");
        }
    };

    // Summary State
    const [summaryData, setSummaryData] = useState(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [showSummaryModal, setShowSummaryModal] = useState(false);

    const handleSummarize = async (file) => {
        setIsSummarizing(true);
        setSummaryData(null);
        setShowSummaryModal(true);

        try {
            const response = await axios.get(`https://finca.onrender.com/api/upload/summarize/${encodeURIComponent(file.fileId)}`, {
                headers: getAuthHeaders(),
                withCredentials: true,
            });

            if (response.data.success) {
                setSummaryData(response.data.data);
            }
        } catch (err) {
            console.error("Summarize error:", err);
            const errorMessage = err.response?.data?.message || err.message || "Failed to generate summary. Please try again.";
            setSummaryData({ summary: `Error: ${errorMessage}` });
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleDelete = async (fileId) => {
        if (!window.confirm("Are you sure you want to delete this document?")) return;

        try {
            // Optimistic update or set loading state could be nice, but simple removal after success is safe
            const response = await axios.delete(`https://finca.onrender.com/api/upload/${encodeURIComponent(fileId)}`, {
                headers: getAuthHeaders(),
                withCredentials: true,
            });

            if (response.data.success) {
                setDocuments(documents.filter(doc => doc.fileId !== fileId));
            }
        } catch (err) {
            console.error("Delete error:", err);
            alert(err.response?.data?.message || "Failed to delete document.");
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
                        <p className="text-muted-foreground mt-2">
                            View and manage your uploaded financial documents and generated reports.
                        </p>
                    </div>
                    <Button variant="outline" onClick={fetchDocuments}>
                        Refresh
                    </Button>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        <span>{error}</span>
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Uploaded Documents</CardTitle>
                        <CardDescription>
                            A list of all PDF documents you have uploaded for processing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                                <p>Loading documents...</p>
                            </div>
                        ) : documents.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <FileText className="h-12 w-12 mb-4 opacity-50" />
                                <h3 className="text-lg font-medium text-foreground">No documents found</h3>
                                <p>Upload your first PDF to get started.</p>
                                <Button className="mt-4" asChild>
                                    <a href="/upload">Upload Document</a>
                                </Button>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Document Name</TableHead>
                                            <TableHead>Date Uploaded</TableHead>
                                            <TableHead>Size</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {documents.map((doc) => (
                                            <TableRow key={doc.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-blue-500" />
                                                        {doc.fileName}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(doc.uploadedAt).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <HardDrive className="h-4 w-4" />
                                                        {formatSize(doc.size)}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => handleSummarize(doc)}>
                                                            <Sparkles className="h-4 w-4 text-primary mr-1" />
                                                            Analyze
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => verifyFile(doc)}>
                                                            View
                                                        </Button>
                                                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(doc.fileId)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* AI Analysis Modal */}
                {showSummaryModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                            <div className="p-6 border-b border-border flex justify-between items-center bg-muted/10">
                                <h3 className="text-xl font-semibold flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    AI Analysis
                                </h3>
                                <Button variant="ghost" size="icon" onClick={() => setShowSummaryModal(false)}>
                                    X
                                </Button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1">
                                {isSummarizing ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                        <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                                        <p>Analyzing document structure and figures...</p>
                                    </div>
                                ) : summaryData ? (
                                    <div className="space-y-6">
                                        {/* Executive Summary */}
                                        <div>
                                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Executive Summary</h4>
                                            <p className="text-foreground leading-relaxed bg-muted/20 p-4 rounded-lg border border-border/50">
                                                {summaryData.summary}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Key Figures */}
                                            {summaryData.key_figures?.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Key Figures</h4>
                                                    <ul className="space-y-2">
                                                        {summaryData.key_figures.map((fig, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                                                <span className="font-medium">{fig}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {/* Important Dates */}
                                            {summaryData.dates?.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Important Dates</h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {summaryData.dates.map((date, i) => (
                                                            <Badge key={i} variant="secondary" className="font-mono">
                                                                {date}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Topics */}
                                        {summaryData.topics?.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Topics Detected</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {summaryData.topics.map((topic, i) => (
                                                        <Badge key={i} variant="outline">
                                                            {topic}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center text-muted-foreground">No analysis available.</div>
                                )}
                            </div>

                            <div className="p-4 border-t border-border bg-muted/20 flex justify-end">
                                <Button onClick={() => setShowSummaryModal(false)}>Close</Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReportPage;