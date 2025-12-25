export const formatDate = (date, showTime = false) => {
  if (!date) return "-";
  const options = {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(showTime && { hour: "2-digit", minute: "2-digit" }),
  };
  return new Date(date).toLocaleDateString("id-ID", options);
};

export const formatDateRange = (dateRange, full = false) => {
  if (!dateRange || !dateRange.includes("to")) return "-";

  const [startStr, endStr] = dateRange.split(" to ").map((d) => d.trim());
  const startDate = new Date(startStr);
  const endDate = new Date(endStr);

  if (startDate.getFullYear() === endDate.getFullYear()) {
      const monthStart = startDate.toLocaleDateString("id-ID", { month: "long" });
      const monthEnd = endDate.toLocaleDateString("id-ID", { month: "long" });
      const year = startDate.getFullYear();
      return `${startDate.getDate()} ${monthStart}  – ${endDate.getDate()} ${monthEnd} ${year}`;
  }

  const startFormatted = startDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const endFormatted = endDate.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return full
    ? `${startFormatted}  –  ${endFormatted}`
    : `${startFormatted}  -  ${endFormatted}`;
};
