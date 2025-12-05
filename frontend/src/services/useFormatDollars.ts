type style = "currency" | "percent" | "unit" | "decimal";

export default function useFormatDollars(
  language: string,
  style: style,
  currency: string
) {
  const formatDollars = Intl.NumberFormat(language, {
    style: style,
    currency: currency,
  });

  const format = (amount: number): string => {
    return `${formatDollars.format(amount)}`;
  };

  return { format };
}
