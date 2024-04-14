export interface IBillTerm {
  Id?: number;
  Name: string;
  TermType: string;
  ApplicableOn: string;
  Type: string;
  Rate: number;
  LinkedLedgerId: string;
}
