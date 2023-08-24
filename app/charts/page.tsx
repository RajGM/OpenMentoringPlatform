import { ResponsivePieCanvas } from "@nivo/pie";

const data = [
  {
    id: "make",
    label: "make",
    value: 54,
    color: "hsl(221, 70%, 50%)",
  },
  {
    id: "elixir",
    label: "elixir",
    value: 421,
    color: "hsl(151, 70%, 50%)",
  },
  {
    id: "javascript",
    label: "javascript",
    value: 272,
    color: "hsl(204, 70%, 50%)",
  },
  {
    id: "python",
    label: "python",
    value: 182,
    color: "hsl(224, 70%, 50%)",
  },
  {
    id: "hack",
    label: "hack",
    value: 554,
    color: "hsl(92, 70%, 50%)",
  },
  {
    id: "lisp",
    label: "lisp",
    value: 268,
    color: "hsl(237, 70%, 50%)",
  },
  {
    id: "c",
    label: "c",
    value: 51,
    color: "hsl(9, 70%, 50%)",
  },
  {
    id: "go",
    label: "go",
    value: 119,
    color: "hsl(272, 70%, 50%)",
  },
  {
    id: "erlang",
    label: "erlang",
    value: 181,
    color: "hsl(35, 70%, 50%)",
  },
  {
    id: "stylus",
    label: "stylus",
    value: 392,
    color: "hsl(344, 70%, 50%)",
  },
  {
    id: "haskell",
    label: "haskell",
    value: 421,
    color: "hsl(266, 70%, 50%)",
  },
  {
    id: "sass",
    label: "sass",
    value: 487,
    color: "hsl(74, 70%, 50%)",
  },
  {
    id: "php",
    label: "php",
    value: 556,
    color: "hsl(191, 70%, 50%)",
  },
  {
    id: "java",
    label: "java",
    value: 183,
    color: "hsl(273, 70%, 50%)",
  },
  {
    id: "scala",
    label: "scala",
    value: 419,
    color: "hsl(183, 70%, 50%)",
  },
  {
    id: "rust",
    label: "rust",
    value: 218,
    color: "hsl(129, 70%, 50%)",
  },
  {
    id: "ruby",
    label: "ruby",
    value: 517,
    color: "hsl(118, 70%, 50%)",
  },
  {
    id: "css",
    label: "css",
    value: 178,
    color: "hsl(237, 70%, 50%)",
  },
];

export default function Chat() {
  return (
    <>
      <ResponsivePieCanvas
        data={data}
        margin={{ top: 40, right: 200, bottom: 40, left: 80 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        colors={{ scheme: "paired" }}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.6]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="#333333"
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "rgba(255, 255, 255, 0.3)",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        fill={[
          {
            match: {
              id: "ruby",
            },
            id: "dots",
          },
          {
            match: {
              id: "c",
            },
            id: "dots",
          },
          {
            match: {
              id: "go",
            },
            id: "dots",
          },
          {
            match: {
              id: "python",
            },
            id: "dots",
          },
          {
            match: {
              id: "scala",
            },
            id: "lines",
          },
          {
            match: {
              id: "lisp",
            },
            id: "lines",
          },
          {
            match: {
              id: "elixir",
            },
            id: "lines",
          },
          {
            match: {
              id: "javascript",
            },
            id: "lines",
          },
        ]}
        legends={[
          {
            anchor: "right",
            direction: "column",
            justify: false,
            translateX: 140,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 60,
            itemHeight: 14,
            itemTextColor: "#999",
            itemDirection: "left-to-right",
            itemOpacity: 1,
            symbolSize: 14,
            symbolShape: "circle",
          },
        ]}
      />
    </>
  );
}
