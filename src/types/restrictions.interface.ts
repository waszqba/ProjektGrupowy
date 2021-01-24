export interface RestrictionInterface {
  quarantine: number;
  restrictions: {
    countryId: number;
    type: number;
  }[] | null;
}

export interface RestrictionsCollectionInterface {
  [id: number]: RestrictionInterface;
}
