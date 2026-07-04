export interface ApiFeedbackListQuery {
  readonly opportunityId?: string;
}

export function parseFeedbackListQuery(query: ApiFeedbackListQuery | undefined): ApiFeedbackListQuery {
  const opportunityId = query?.opportunityId;
  return opportunityId === undefined || opportunityId.trim().length === 0 ? {} : { opportunityId };
}

