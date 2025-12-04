import { AlertCircle, Clock, FileX } from "lucide-react"
import { Card } from "@/components/ui/card"

export function Problem() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight lg:text-4xl mb-4">The Problem with Traditional Reporting</h2>
          <p className="text-balance text-lg text-muted-foreground leading-relaxed">
            Financial reporting is time-consuming, repetitive, and error-prone
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <Card className="border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <Clock className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-card-foreground">Hours of Manual Work</h3>
            <p className="text-muted-foreground leading-relaxed">
              Accountants spend countless hours manually cleaning data, classifying transactions, and formatting
              reports.
            </p>
          </Card>

          <Card className="border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <FileX className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-card-foreground">Error-Prone Process</h3>
            <p className="text-muted-foreground leading-relaxed">
              Manual data entry and calculations lead to mistakes that can cause compliance issues and financial
              penalties.
            </p>
          </Card>

          <Card className="border-border bg-card p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-card-foreground">Missed Deadlines</h3>
            <p className="text-muted-foreground leading-relaxed">
              Time-intensive processes lead to rushed work and missed compliance deadlines under pressure.
            </p>
          </Card>
        </div>
      </div>
    </section>
  )
}
