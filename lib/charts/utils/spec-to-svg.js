export const specToSvg = async (spec) => {
  const [vega, vegaLite] = await Promise.all([
    import("vega"),
    import("vega-lite"),
  ]);
  const { spec: vegaSpec } = vegaLite.compile(spec);
  const view = new vega.View(vega.parse(vegaSpec), { renderer: "none" });

  return view.toSVG();
};
