import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/http/api.service';
import { firstValueFrom } from 'rxjs';

interface LedgerEntry {
  id: number;
  date: string;
  description: string;
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  category: string;
  partyId: number;
  party: {
    id: number;
    name: string;
  };
  runningBalance?: number;
}

interface Party {
  id: number;
  name: string;
}

interface NewEntry {
  partyId: number | null;
  amount: number | null;
  type: 'DEBIT' | 'CREDIT';
  category: string;
  description: string;
  date: string;
}

@Component({
  selector: 'app-ledger',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.css']
})
export class LedgerComponent implements OnInit {

  public entries: LedgerEntry[] = [];
  public parties: Party[] = [];
  public selectedPartyId: number | null = null;

  public isLoading = true;
  public error: string | null = null;

  public totalCredit = 0;
  public totalDebit = 0;
  public netBalance = 0;

  public accounts: { id: number | null, name: string, balance: number }[] = [];

  public cashBalance = 0;
  public selectedAccountName = 'All Accounts';

  public newEntry: NewEntry = this.getDefaultEntry();

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedPartyId = params['partyId'] ? Number(params['partyId']) : null;
      this.loadData();
    });
  }

  private getDefaultEntry(): NewEntry {
    return {
      partyId: null,
      amount: null,
      type: 'CREDIT',
      category: '',
      description: '',
      date: new Date().toISOString().substring(0, 10)
    };
  }

  async loadData() {
    this.isLoading = true;
    this.error = null;

    try {
      const partiesData = await firstValueFrom(this.api.get<Party[]>('/parties'));
      this.parties = partiesData || [];

      const allEntries = await firstValueFrom(this.api.get<LedgerEntry[]>('/ledger'));
      let entriesData = allEntries || [];

      // ✅ Sort by date (VERY IMPORTANT for running balance)
      entriesData = entriesData.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      this.calculateAccounts(entriesData);

      this.entries = this.selectedPartyId
        ? entriesData.filter(e => e.partyId === this.selectedPartyId)
        : entriesData;

      this.calculateSummaries();
      this.calculateRunningBalance();
      this.setSelectedAccountName();

    } catch (err) {
      console.error(err);
      this.error = 'Failed to load ledger data';
    } finally {
      this.isLoading = false;
    }
  }

  calculateAccounts(allEntries: LedgerEntry[]) {
    const accountMap = new Map<number | null, { name: string, balance: number }>();

    const totalBalance = allEntries.reduce((acc, e) => {
      const amt = Number(e.amount) || 0;
      return acc + (e.type === 'CREDIT' ? amt : -amt);
    }, 0);

    this.cashBalance = totalBalance;
    accountMap.set(null, { name: 'Cash in hand', balance: totalBalance });

    allEntries.forEach(entry => {
      const partyId = entry.partyId;
      const partyName = entry.party?.name || 'Unknown';
      const amt = Number(entry.amount) || 0;
      const value = entry.type === 'CREDIT' ? amt : -amt;

      if (!accountMap.has(partyId)) {
        accountMap.set(partyId, { name: partyName, balance: 0 });
      }

      accountMap.get(partyId)!.balance += value;
    });

    this.accounts = Array.from(accountMap.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      balance: data.balance
    }));
  }

  calculateSummaries() {
    this.totalCredit = this.entries
      .filter(e => e.type === 'CREDIT')
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

    this.totalDebit = this.entries
      .filter(e => e.type === 'DEBIT')
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

    this.netBalance = this.totalCredit - this.totalDebit;
  }

  calculateRunningBalance() {
    let balance = 0;

    this.entries.forEach(entry => {
      const amt = Number(entry.amount) || 0;
      balance += entry.type === 'CREDIT' ? amt : -amt;
      entry.runningBalance = balance;
    });
  }

  setSelectedAccountName() {
    if (!this.selectedPartyId) {
      this.selectedAccountName = 'All Accounts';
      return;
    }

    const acc = this.accounts.find(a => a.id === this.selectedPartyId);
    this.selectedAccountName = acc?.name || 'Account';
  }

  onAccountSelect(accountId: number | null) {
    this.newEntry.partyId = accountId;

    this.router.navigate(
      accountId ? ['/ledger', accountId] : ['/ledger']
    );
  }

  async addEntry() {
    if (!this.newEntry.partyId || !this.newEntry.amount) {
      this.error = 'Party and Amount are required';
      return;
    }

    try {
      await firstValueFrom(this.api.post('/ledger', this.newEntry));
      this.newEntry = this.getDefaultEntry();
      await this.loadData();
    } catch (err) {
      console.error(err);
      this.error = 'Failed to create entry';
    }
  }
}
