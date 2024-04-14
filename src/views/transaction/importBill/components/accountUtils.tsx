export function isAccountUsed(accountId: any, selectedAccounts: any) {
  for (const account of selectedAccounts) {
    if (account && account.id === accountId) {
      return true;
    }
  }
  return false;
}
