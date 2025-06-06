import championDataset from "@/_datasets/champion.json";
import playratesData from "@/_datasets/playrates.json";

export interface Champion {
  key: string;
  name: string;
  roles: string[];
}

// Function to determine which roles a champion belongs to
function getChampionRoles(championKey: string): string[] {
  const roles: string[] = [];
  for (const [roleName, champions] of Object.entries(playratesData)) {
    if (championKey in champions) {
      roles.push(roleName);
    }
  }
  return roles;
}

export const championsMap: Champion[] = Object.values(championDataset.data)
  .map((champInfo) => {
    const champion: Champion = {
      key: champInfo.key,
      name: champInfo.name,
      roles: getChampionRoles(champInfo.key),
    };
    return champion;
  })
  .toSorted((a, b) => a.name.localeCompare(b.name));

export const championByKey = new Map<string, Champion>(championsMap.map((champ) => [champ.key, champ]));

export const championByName = new Map<string, Champion>(championsMap.map((champ) => [champ.name.toLowerCase(), champ]));

export const CHAMPION_COUNT = championsMap.length;

export function searchChampions(query: string): Champion[] {
  if (!query.trim()) return championsMap;

  const normalizedSearch = query
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['\s]/g, "");

  return championsMap.filter((champion) => {
    const normalizedName = champion.name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/['\s]/g, "");

    return normalizedName.includes(normalizedSearch);
  });
}
