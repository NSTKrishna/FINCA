import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-20 lg:px-16 lg:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />

          <div className="relative mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground lg:text-4xl mb-6 text-balance">
              Ready to Transform Your Financial Reporting?
            </h2>
            <p className="mb-10 text-balance text-lg text-primary-foreground/80 leading-relaxed">
              Join hundreds of accountants and businesses saving hours every week with AI-powered automation.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" variant="secondary" className="group">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <p className="mt-8 text-sm text-primary-foreground/60">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
