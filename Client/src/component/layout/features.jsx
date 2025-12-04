import { Brain, FileText, Shield, Zap, Database, Download } from "lucide-react"
import { Card } from "@/components/ui/card"

const features = [
  {
    icon: Database,
    title: "Smart Data Ingestion",
    description:
      "Upload Excel/CSV files or connect to accounting APIs like Tally and QuickBooks for seamless data import.",
  },
  {
    icon: Brain,
    title: "AI-Powered Classification",
    description: "Automatic transaction classification for sales, purchases, expenses, and GST with anomaly detection.",
  },
  {
    icon: Zap,
    title: "Instant Calculations",
    description: "Generate accurate GST summaries, P&L statements, audit flags, and cash flow summaries in seconds.",
  },
  {
    icon: FileText,
    title: "Professional Reports",
    description:
      "AI-drafted audit summaries with commentary, expense trends, and compliance notes tailored to your needs.",
  },
  {
    icon: Download,
    title: "Export-Ready PDFs",
    description: "Professional-quality PDF reports with cover pages, tables, and charts ready to share with clients.",
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "Enterprise-grade security with role-based access control and full audit trail for compliance.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 lg:py-32 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">
            Everything You Need to Automate Financial Reporting
          </h2>
          <p className="text-balance text-lg text-muted-foreground leading-relaxed">
            Powered by AI to deliver accurate, professional reports in minutes
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-border bg-card p-8 hover:shadow-lg transition-shadow">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <feature.icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-card-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
