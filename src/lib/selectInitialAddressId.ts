// 既定の配送先（is_default === true）があればその id、なければ先頭の id を返す
export type AddressLike = { id: number; is_default?: boolean | null };

export function selectInitialAddressId(list: AddressLike[] | null | undefined): number | null {
  if (!list || list.length === 0) return null;
  const d = list.find(a => !!a && !!a.is_default);
  return d ? d.id : list[0]!.id;
}
