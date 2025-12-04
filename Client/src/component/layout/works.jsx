import { Upload, Cpu, FileCheck, Download } from "lucide-react"

const steps = [
  {
    icon: Upload,
    number: "01",
    title: "Upload Your Data",
    description: "Import raw accounting data via Excel, CSV, or connect directly to your accounting software.",
  },
  {
    icon: Cpu,
    number: "02",
    title: "AI Processing",
    description: "Our AI engine classifies transactions, detects anomalies, and performs all necessary calculations.",
  },
  {
    icon: FileCheck,
    number: "03",
    title: "Review & Customize",
    description: "Preview AI-generated reports and summaries. Make adjustments if needed with our intuitive dashboard.",
  },
  {
    icon: Download,
    number: "04",
    title: "Export & Share",
    description: "Download professional PDF reports ready to share with clients, auditors, or tax authorities.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">How FINCA.AI Works</h2>
          <p className="text-balance text-lg text-muted-foreground leading-relaxed">
            From raw data to professional reports in four simple steps
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 border-2 border-accent/20">
                <step.icon className="h-8 w-8 text-accent" />
              </div>
              <div className="mb-2 text-sm font-mono text-accent">{step.number}</div>
              <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>

              {index < steps.length - 1 && (
                <div className="absolute top-8 left-16 hidden h-0.5 w-full bg-border lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
