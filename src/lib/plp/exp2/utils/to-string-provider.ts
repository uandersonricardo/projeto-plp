export class ToStringProvider {
  public static listToString<T>(list: T[], before: string, after: string, separator: string): string {
    const sb: string[] = [];
    sb.push(before);

    for (const object of list) {
      sb.push(String(object));
      sb.push(separator);
      sb.push(" ");
    }

    if (sb.length >= 2) {
      const separatorLength = separator.length;
      const lastIndex = sb.length - 1;
      const secondLastIndex = lastIndex - 1;

      sb.splice(secondLastIndex, separatorLength + 1);
    }

    sb.push(after);
    return sb.join("");
  }

  public static listToStringSimple<T>(list: T[], separator: string): string {
    return ToStringProvider.listToString(list, "", "", separator);
  }
}
