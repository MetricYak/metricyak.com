import type { GatsbyBrowser } from "gatsby"
import "./src/styles/global.css"

export const onClientEntry: GatsbyBrowser["onClientEntry"] = () => {
  console.log("%cMetricYak.", "font-weight:800;font-size:20px;color:#D9591A")
  console.log(
    "Poking around in here? Respect. The source is at github.com/metricyak/metricyak — come find out why your metrics did that."
  )
}
