
export function initialName(name: string): string {
    const nameParts = name.split(" ");
    if (nameParts.length >= 2) {
        return nameParts[0][0] + nameParts[1][0];
    }
    return name[0];
}
