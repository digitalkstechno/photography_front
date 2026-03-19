import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/http/api.service';
import { firstValueFrom } from 'rxjs';

interface LedgerEntry {
  _id: string;
  date: string;
  description: string;
  amount: number;
  type: 'IN' | 'OUT';
  mode: string;
  category?: string;
  partyId: string;
  party: {
    _id: string;
    name: string;
  };
  runningBalance: number;
}

interface Party {
  _id: string;
  name: string;
}

interface PartyBalance {
  partyId: string;
  partyName: string;
  partyType: string;
  totalCredit: number;
  totalDebit: number;
  balance: number;
}

interface NewEntry {
  partyId: string | null;
  amount: number | null;
  type: 'IN' | 'OUT';
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
  public balances: PartyBalance[] = [];
  public party: Party | null = null;
  public selectedPartyId: string | null = null;

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
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedPartyId = params['partyId'] || null;
      this.loadData();
    });
  }

  private getDefaultEntry(): NewEntry {
    return {
      partyId: null,
      amount: null,
      type: 'IN',
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

      const response = await firstValueFrom(this.api.get<any>('/payments'));
      let entriesData = response.data || [];

      // ✅ Sort by date (VERY IMPORTANT for running balance)
      entriesData = entriesData.sort(
        (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      this.calculateAccounts(entriesData);
      this.calculateBalances(entriesData);

      this.party = this.selectedPartyId
        ? this.parties.find(p => p._id === this.selectedPartyId) || null
        : null;

      this.entries = this.selectedPartyId
        ? entriesData.filter((e: any) => (e.partyId || e.party?._id) === this.selectedPartyId)
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
      return acc + (e.type === 'IN' ? amt : -amt);
    }, 0);

    this.cashBalance = totalBalance;
    accountMap.set(null, { name: 'Cash in hand', balance: totalBalance });

    allEntries.forEach(entry => {
      const partyId = entry.partyId || (entry.party as any)?._id;
      const partyName = entry.party?.name || 'Unknown';
      const amt = Number(entry.amount) || 0;
      const value = entry.type === 'IN' ? amt : -amt;

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
      .filter(e => e.type === 'IN')
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

    this.totalDebit = this.entries
      .filter(e => e.type === 'OUT')
      .reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

    this.netBalance = this.totalCredit - this.totalDebit;
  }

  calculateRunningBalance() {
    let balance = 0;

    this.entries.forEach(entry => {
      const amt = Number(entry.amount) || 0;
      balance += entry.type === 'IN' ? amt : -amt;
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

  onAccountSelect(accountId: string | null) {
    this.newEntry.partyId = accountId;

    this.router.navigate(
      accountId ? ['/ledger', accountId] : ['/ledger']
    );
  }

  onPartySelect(partyId: string) {
    this.router.navigate(['/ledger', partyId]);
  }

  goBack() {
    this.router.navigate(['/ledger']);
  }

  private calculateBalances(allEntries: LedgerEntry[]) {
    const map = new Map<number, PartyBalance>();

    allEntries.forEach(entry => {
      const pid = entry.partyId || (entry.party as any)?._id;
      if (!map.has(pid)) {
        map.set(pid, {
          partyId: pid,
          partyName: entry.party?.name || 'Unknown',
          partyType: entry.category || '—',
          totalCredit: 0,
          totalDebit: 0,
          balance: 0,
        });
      }

      const row = map.get(pid)!;
      const amt = Number(entry.amount) || 0;
      if (entry.type === 'IN') {
        row.totalCredit += amt;
      } else {
        row.totalDebit += amt;
      }
      row.balance = row.totalCredit - row.totalDebit;
    });

    this.balances = Array.from(map.values());
  }

  async addEntry() {
    if (!this.newEntry.partyId || !this.newEntry.amount) {
      this.error = 'Party and Amount are required';
      return;
    }

    try {
      await firstValueFrom(this.api.post('/payments', this.newEntry));
      this.newEntry = this.getDefaultEntry();
      await this.loadData();
    } catch (err) {
      console.error(err);
      this.error = 'Failed to create entry';
    }
  }
}
