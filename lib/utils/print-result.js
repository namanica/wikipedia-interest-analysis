const OUTPUT_BUDGET_BYTES = 4096;

export const printResult = ({
  summary,
  data,
  files = [],
  hints = [],
  networkRequests,
}) => {
  const output = JSON.stringify({
    ok: true,
    summary,
    data,
    files,
    hints,
    network_requests: networkRequests,
  });
  const bytes = Buffer.byteLength(output);

  if (bytes > OUTPUT_BUDGET_BYTES) {
    process.stderr.write(
      `Warning: output is ${bytes} bytes, over the ${OUTPUT_BUDGET_BYTES}-byte budget.\n`,
    );
  }

  process.stdout.write(`${output}\n`);
};
