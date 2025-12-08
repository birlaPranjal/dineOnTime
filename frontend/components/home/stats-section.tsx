const stats = [
  { value: "70%", label: "Reduced wait time" },
  { value: "2x", label: "Table turnover increase" },
  { value: "95%", label: "Customer satisfaction" },
  { value: "500+", label: "Restaurant partners" },
]

export function StatsSection() {
  return (
    <section className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
