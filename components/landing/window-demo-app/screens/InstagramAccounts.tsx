// @ts-nocheck — verbatim copy of the desktop app source (B2DM); types live there.
import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, AtSign, Eye, EyeOff, FileUp, Globe, Instagram, KeyRound, Loader2, MousePointerClick, Plus, RefreshCw, Search, Trash2, Upload, Users } from 'lucide-react';
import { cn } from '@/components/landing/window-demo-app/lib/cn';
import { Button } from '@/components/landing/window-demo-app/components/ui/button';
import { Label } from '@/components/landing/window-demo-app/components/ui/label';
import { Textarea } from '@/components/landing/window-demo-app/components/ui/textarea';
import { Dialog } from '@/components/landing/window-demo-app/components/ui/dialog';
import { Badge } from '@/components/landing/window-demo-app/components/ui/badge';
import { Switch } from '@/components/landing/window-demo-app/components/ui/switch';
import { EmptyState } from '@/components/landing/window-demo-app/components/common/EmptyState';
import { Spinner } from '@/components/landing/window-demo-app/components/common/Spinner';
import { useAccounts } from '@/components/landing/window-demo-app/context/AccountsContext';
import { b2dm } from '@/components/landing/window-demo-app/lib/b2dm';
import { useTranslation } from '@/components/landing/window-demo-app/lib/i18n';
import type { AccountPublic } from '@/components/landing/window-demo-app/types/domain';

type StatusFilter = 'all' | AccountPublic['status'];

function normalizeProxyUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^(https?|socks5):\/\//i.test(trimmed)) return trimmed;
  return `http://${trimmed}`;
}

function StatusBadge({ status }: { status: AccountPublic['status'] }) {
  const { t } = useTranslation();
  if (status === 'busy') return <Badge variant="warning">{t('screens.instagramAccounts.statusRunning')}</Badge>;
  if (status === 'error') return <Badge variant="destructive">{t('screens.instagramAccounts.statusError')}</Badge>;
  return <Badge variant="success">{t('screens.instagramAccounts.statusIdle')}</Badge>;
}

function AccountRow({
  account,
  onDelete,
  onConfigureProxy,
  onRetry,
}: {
  account: AccountPublic;
  onDelete: () => void;
  onConfigureProxy: () => void;
  onRetry: () => void;
}) {
  const { t } = useTranslation();
  return (
    <tr className="border-t border-border bg-background even:bg-muted last:border-b hover:bg-accent">
      <td className="px-3 py-1.5">
        <div className="flex items-center gap-2.5">
          {account.profilePicUrl ? (
            <img
              src={account.profilePicUrl}
              alt={account.username}
              className="h-6 w-6 flex-none rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Instagram className="h-3 w-3" />
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-medium leading-tight">@{account.username}</div>
          </div>
        </div>
      </td>
      <td className="px-3 py-1.5">
        <div className="flex flex-wrap items-center gap-1">
          <StatusBadge status={account.status} />
        </div>
      </td>
      <td className="px-3 py-1.5">
        {account.proxyUrl ? (
          <div
            className={cn(
              'flex min-w-0 items-center gap-1.5 text-xs',
              !account.proxyEnabled && 'opacity-60'
            )}
          >
            <Globe className="h-3 w-3 flex-none text-muted-foreground" />
            <span className={cn('font-mono', !account.proxyEnabled && 'line-through')}>
              {account.proxyUrl}
            </span>
            {account.proxyUsername ? (
              <span
                className={cn(
                  'font-mono text-muted-foreground',
                  !account.proxyEnabled && 'line-through'
                )}
              >
                - {account.proxyUsername}
              </span>
            ) : null}
            {!account.proxyEnabled ? (
              <Badge variant="muted" className="text-[10px]">
                {t('screens.instagramAccounts.proxyDisabled')}
              </Badge>
            ) : null}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">{t('screens.instagramAccounts.directConnection')}</span>
        )}
      </td>
      <td className="px-3 py-1.5 text-right text-[11px] text-muted-foreground">
        {new Date(account.updatedAt).toLocaleDateString()}
      </td>
      <td className="px-2 py-1.5">
        <div className="flex items-center justify-end gap-0.5">
          {account.status === 'error' ? (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              aria-label={t('screens.instagramAccounts.retryLogin')}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={onConfigureProxy}
            className="inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            aria-label={t('screens.instagramAccounts.configureProxy')}
          >
            <Globe className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={account.status === 'busy'}
            className="inline-flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground"
            aria-label={t('screens.instagramAccounts.deleteAccount')}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function RetryLoginDialog({
  account,
  onClose,
}: {
  account: AccountPublic;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasStored = account.hasStoredPassword;

  async function submit(useStored: boolean) {
    setBusy(true);
    setError(null);
    try {
      await b2dm.accounts.retryLogin(account.id, useStored ? null : password);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('screens.instagramAccounts.couldNotStartRetry'));
    } finally {
      setBusy(false);
    }
  }

  const canRetryStored = hasStored && !busy;
  const canSubmitTyped = password.trim().length > 0 && !busy;

  return (
    <Dialog
      open
      onClose={onClose}
      title={t('screens.instagramAccounts.retryDialogTitle', { username: account.username })}
      description={
        hasStored
          ? t('screens.instagramAccounts.retryDialogDescriptionStored')
          : t('screens.instagramAccounts.retryDialogDescriptionTyped')
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {t('common.cancel')}
          </Button>
          {hasStored ? (
            <Button variant="outline" onClick={() => submit(true)} disabled={!canRetryStored}>
              {busy ? <Spinner /> : null}
              {t('screens.instagramAccounts.useSavedPassword')}
            </Button>
          ) : null}
          <Button onClick={() => submit(false)} disabled={!canSubmitTyped}>
            {busy ? <Spinner /> : null}
            {t('screens.instagramAccounts.signIn')}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        {account.lastError ? (
          <div className="flex items-start gap-2 border border-destructive/30 bg-destructive/10 p-2 text-xs text-destructive">
            <AlertTriangle className="h-3.5 w-3.5 flex-none translate-y-0.5" />
            <span>{account.lastError}</span>
          </div>
        ) : null}
        <div className="space-y-1">
          <Label htmlFor="retry-password">
            {hasStored ? t('screens.instagramAccounts.newPasswordLabel') : t('screens.instagramAccounts.passwordLabel')}
          </Label>
          <SquareIconInput
            id="retry-password"
            icon={KeyRound}
            type={showPassword ? 'text' : 'password'}
            placeholder={hasStored ? t('screens.instagramAccounts.passwordSavedPlaceholder') : t('screens.instagramAccounts.passwordPlaceholder')}
            value={password}
            onChange={setPassword}
            disabled={busy}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                disabled={busy}
                className="flex w-10 flex-none items-center justify-center border-l border-border text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? t('common.hidePassword') : t('common.showPassword')}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
        </div>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    </Dialog>
  );
}

const STATUS_FILTERS: { value: StatusFilter; labelKey: string }[] = [
  { value: 'all', labelKey: 'screens.instagramAccounts.filterAll' },
  { value: 'idle', labelKey: 'screens.instagramAccounts.filterIdle' },
  { value: 'busy', labelKey: 'screens.instagramAccounts.filterRunning' },
  { value: 'error', labelKey: 'screens.instagramAccounts.filterError' },
];

function ProxyDialog({
  account,
  onClose,
  onRequestRemove,
}: {
  account: AccountPublic;
  onClose: () => void;
  onRequestRemove: () => void;
}) {
  const { t } = useTranslation();
  const [url, setUrl] = useState(account.proxyUrl ?? '');
  const [username, setUsername] = useState(account.proxyUsername ?? '');
  const [password, setPassword] = useState('');
  const [enabled, setEnabled] = useState(account.proxyEnabled);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasSavedProxy = !!account.proxyUrl;
  const busy = saving;

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const normalized = normalizeProxyUrl(url);
      await b2dm.accounts.updateProxy({
        id: account.id,
        url: normalized || null,
        username: username.trim() || null,
        password: password.length > 0 ? password : null,
        enabled,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('screens.instagramAccounts.couldNotSaveProxy'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={t('screens.instagramAccounts.configureProxyTitle')}
      description={t('screens.instagramAccounts.configureProxyDescription', { username: account.username })}
      footer={
        <>
          {hasSavedProxy ? (
            <Button variant="ghost" onClick={onRequestRemove} disabled={busy} className="mr-auto text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400">
              <Trash2 className="h-3.5 w-3.5" />
              {t('screens.instagramAccounts.removeProxy')}
            </Button>
          ) : null}
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {t('common.cancel')}
          </Button>
          <Button onClick={save} disabled={busy}>
            {saving ? <Spinner /> : null}
            {saving ? t('common.saving') : t('common.save')}
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3 border border-border bg-muted/20 px-3 py-2 text-sm">
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-medium">{t('screens.instagramAccounts.proxyEnabled')}</span>
            {!enabled ? (
              <Badge variant="muted" className="text-[10px]">
                {t('screens.instagramAccounts.proxyDisabled')}
              </Badge>
            ) : null}
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={setEnabled}
            disabled={busy || !url.trim()}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="proxy-url">{t('screens.instagramAccounts.proxyUrlLabel')}</Label>
          <SquareIconInput
            id="proxy-url"
            icon={Globe}
            placeholder={t('screens.instagramAccounts.proxyUrlPlaceholder')}
            value={url}
            onChange={setUrl}
            disabled={busy}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="proxy-user">{t('screens.instagramAccounts.proxyUserLabel')}</Label>
          <SquareIconInput
            id="proxy-user"
            icon={AtSign}
            value={username}
            onChange={setUsername}
            disabled={busy}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="proxy-pass">{t('screens.instagramAccounts.proxyPassLabel')}</Label>
          <SquareIconInput
            id="proxy-pass"
            icon={KeyRound}
            type={showPassword ? 'text' : 'password'}
            placeholder={account.hasProxyPassword ? t('screens.instagramAccounts.proxyPassStoredPlaceholder') : ''}
            value={password}
            onChange={setPassword}
            disabled={busy}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                disabled={busy}
                className="flex w-10 flex-none items-center justify-center border-l border-border text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? t('common.hidePassword') : t('common.showPassword')}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
        </div>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    </Dialog>
  );
}

function ConfirmDeleteDialog({
  account,
  onClose,
}: {
  account: AccountPublic;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      await b2dm.accounts.delete(account.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('screens.instagramAccounts.couldNotDelete'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={t('screens.instagramAccounts.deleteAccountTitle', { username: account.username })}
      description={t('screens.instagramAccounts.deleteAccountDescription')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {t('common.cancel')}
          </Button>
          <Button onClick={confirm} disabled={busy}>
            {busy ? <Spinner /> : null}
            {busy ? t('screens.instagramAccounts.deleting') : t('screens.instagramAccounts.deleteAccountConfirm')}
          </Button>
        </>
      }
    >
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </Dialog>
  );
}

function ConfirmRemoveProxyDialog({
  account,
  onClose,
}: {
  account: AccountPublic;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirm() {
    setBusy(true);
    setError(null);
    try {
      await b2dm.accounts.updateProxy({
        id: account.id,
        url: null,
        username: null,
        password: null,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('screens.instagramAccounts.couldNotRemoveProxy'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open
      onClose={onClose}
      title={t('screens.instagramAccounts.removeProxyTitle', { username: account.username })}
      description={t('screens.instagramAccounts.removeProxyDescription')}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            {t('common.cancel')}
          </Button>
          <Button onClick={confirm} disabled={busy}>
            {busy ? <Spinner /> : null}
            {busy ? t('screens.instagramAccounts.removing') : t('screens.instagramAccounts.removeProxy')}
          </Button>
        </>
      }
    >
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </Dialog>
  );
}

type AddMode = 'manual' | 'credentials' | 'bulk';

const ADD_MODES: { id: AddMode; labelKey: string; icon: typeof MousePointerClick }[] = [
  { id: 'manual', labelKey: 'screens.instagramAccounts.addModeManual', icon: MousePointerClick },
  { id: 'credentials', labelKey: 'screens.instagramAccounts.addModeCredentials', icon: KeyRound },
  { id: 'bulk', labelKey: 'screens.instagramAccounts.addModeBulk', icon: Users },
];

function SquareIconInput({
  id,
  icon: Icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
  trailing,
  dataDemoId,
}: {
  id?: string;
  icon: typeof AtSign;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  trailing?: React.ReactNode;
  dataDemoId?: string;
}) {
  return (
    <div className="flex h-10 items-stretch border border-border bg-background">
      <div className="flex w-10 flex-none items-center justify-center border-r border-border text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        data-demo-id={dataDemoId}
        className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
      />
      {trailing}
    </div>
  );
}

interface ProxyInput {
  url: string;
  username: string | null;
  password: string | null;
}

function AddAccountDialog({
  onClose,
  onChooseManual,
  onChooseAuto,
  onStartBulk,
}: {
  onClose: () => void;
  onChooseManual: (proxy: ProxyInput | null) => Promise<void> | void;
  onChooseAuto: (
    username: string,
    password: string,
    proxy: ProxyInput | null
  ) => Promise<void> | void;
  onStartBulk: (rows: BulkRow[]) => Promise<void>;
}) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<AddMode>('manual');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [proxyEnabled, setProxyEnabled] = useState(false);
  const [proxyUrl, setProxyUrl] = useState('');
  const [proxyUser, setProxyUser] = useState('');
  const [proxyPass, setProxyPass] = useState('');
  const [showProxyPass, setShowProxyPass] = useState(false);

  function buildProxy(): ProxyInput | null {
    if (!proxyEnabled) return null;
    const url = normalizeProxyUrl(proxyUrl);
    if (!url) return null;
    return {
      url,
      username: proxyUser.trim() || null,
      password: proxyPass.length > 0 ? proxyPass : null,
    };
  }

  function validateProxy(): string | null {
    if (!proxyEnabled) return null;
    const url = normalizeProxyUrl(proxyUrl);
    if (!url) return t('screens.instagramAccounts.enterProxyUrl');
    if (!/^(https?|socks5):\/\/[^\s]+:\d+/.test(url)) {
      return t('screens.instagramAccounts.badProxyShape');
    }
    return null;
  }

  const [bulkInput, setBulkInput] = useState<'paste' | 'file'>('paste');
  const [bulkText, setBulkText] = useState('');
  const [bulkParsed, setBulkParsed] = useState<ParsedRow[]>([]);
  const [bulkFileName, setBulkFileName] = useState<string | null>(null);

  useEffect(() => {
    setBulkParsed(parseBulkText(bulkText));
  }, [bulkText]);

  const validRows = useMemo(() => bulkParsed.filter((r) => !r.error), [bulkParsed]);
  const errorRows = useMemo(() => bulkParsed.filter((r) => r.error), [bulkParsed]);

  async function handleFile(file: File) {
    setError(null);
    setBulkFileName(file.name);
    const lower = file.name.toLowerCase();
    try {
      if (lower.endsWith('.csv') || lower.endsWith('.txt')) {
        setBulkText(await file.text());
        return;
      }
      if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
        // xlsx parsing is stripped from the landing demo build; the desktop
        // app handles spreadsheet uploads via the bundled `xlsx` module.
        setError('Spreadsheet uploads are only supported in the desktop app. Use .csv or .txt here.');
        return;
      }
      setError(t('screens.instagramAccounts.unsupportedFileType'));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('screens.instagramAccounts.couldNotReadFile'));
    }
  }

  async function handleContinue() {
    setError(null);
    if (mode === 'manual') {
      const proxyErr = validateProxy();
      if (proxyErr) {
        setError(proxyErr);
        return;
      }
      setBusy(true);
      try {
        await onChooseManual(buildProxy());
      } catch (err) {
        setError(err instanceof Error ? err.message : t('screens.instagramAccounts.couldNotStartLogin'));
      } finally {
        setBusy(false);
      }
      return;
    }
    if (mode === 'credentials') {
      if (!username.trim() || !password.trim()) {
        setError(t('screens.instagramAccounts.enterUserAndPass'));
        return;
      }
      const proxyErr = validateProxy();
      if (proxyErr) {
        setError(proxyErr);
        return;
      }
      setBusy(true);
      try {
        await onChooseAuto(username, password, buildProxy());
      } catch (err) {
        setError(err instanceof Error ? err.message : t('screens.instagramAccounts.couldNotStartLogin'));
      } finally {
        setBusy(false);
      }
      return;
    }
    // bulk
    if (validRows.length === 0) {
      setError(t('screens.instagramAccounts.noValidRows'));
      return;
    }
    setBusy(true);
    try {
      await onStartBulk(
        validRows.map((r) => ({
          username: r.username,
          password: r.password,
          proxyUrl: r.proxyUrl,
          proxyUsername: r.proxyUsername,
          proxyPassword: r.proxyPassword,
        }))
      );
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('screens.instagramAccounts.couldNotStartBulk'));
    } finally {
      setBusy(false);
    }
  }

  const continueLabel =
    mode === 'manual'
      ? t('common.continue')
      : mode === 'credentials'
      ? busy
        ? t('screens.instagramAccounts.signingIn')
        : t('screens.instagramAccounts.signIn')
      : busy
      ? t('common.starting')
      : t('screens.instagramAccounts.importAccounts', { count: validRows.length });

  const disabled =
    busy ||
    (mode === 'credentials' && (!username.trim() || !password.trim())) ||
    (mode === 'bulk' && validRows.length === 0);

  return (
    <Dialog
      open
      onClose={onClose}
      title={t('screens.instagramAccounts.addDialogTitle')}
      description={t('screens.instagramAccounts.addDialogDescription')}
      className="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy} data-demo-id="add-account-cancel">
            {t('common.cancel')}
          </Button>
          <Button onClick={handleContinue} disabled={disabled}>
            {busy ? <Spinner /> : null}
            {continueLabel}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-stretch border border-border">
          {ADD_MODES.map((m, idx) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                disabled={busy}
                data-demo-id={`add-account-mode-${m.id}`}
                className={cn(
                  'inline-flex h-9 flex-1 items-center justify-center gap-1.5 px-3 text-xs font-medium transition-colors',
                  idx !== ADD_MODES.length - 1 && 'border-r border-border',
                  active
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-background text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t(m.labelKey)}
              </button>
            );
          })}
        </div>

        {mode === 'manual' ? (
          <div className="border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            {t('screens.instagramAccounts.manualHint')}
          </div>
        ) : null}

        {mode === 'credentials' ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="ig-username">{t('screens.instagramAccounts.usernameOrEmailLabel')}</Label>
              <SquareIconInput
                id="ig-username"
                icon={AtSign}
                value={username}
                onChange={setUsername}
                placeholder={t('screens.instagramAccounts.usernameOrEmailPlaceholder')}
                disabled={busy}
                dataDemoId="add-account-username"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ig-password">{t('screens.instagramAccounts.credentialsPasswordLabel')}</Label>
              <SquareIconInput
                id="ig-password"
                icon={KeyRound}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                placeholder={t('screens.instagramAccounts.passwordPlaceholder')}
                disabled={busy}
                dataDemoId="add-account-password"
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    disabled={busy}
                    className="flex w-10 flex-none items-center justify-center border-l border-border text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? t('common.hidePassword') : t('common.showPassword')}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
              />
            </div>
          </div>
        ) : null}

        {mode !== 'bulk' ? (
          <div className="space-y-2 border border-border bg-muted/20 p-3">
            <div className="flex items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">{t('screens.instagramAccounts.routeProxy')}</span>
              </div>
              <Switch
                checked={proxyEnabled}
                onCheckedChange={setProxyEnabled}
                disabled={busy}
              />
            </div>
            {proxyEnabled ? (
              <div className="space-y-2 pt-1">
                <SquareIconInput
                  icon={Globe}
                  placeholder={t('screens.instagramAccounts.proxyUrlPlaceholder')}
                  value={proxyUrl}
                  onChange={setProxyUrl}
                  disabled={busy}
                />
                <div className="grid grid-cols-2 gap-2">
                  <SquareIconInput
                    icon={AtSign}
                    placeholder={t('screens.instagramAccounts.proxyUserLabel')}
                    value={proxyUser}
                    onChange={setProxyUser}
                    disabled={busy}
                  />
                  <SquareIconInput
                    icon={KeyRound}
                    type={showProxyPass ? 'text' : 'password'}
                    placeholder={t('screens.instagramAccounts.proxyPassLabel')}
                    value={proxyPass}
                    onChange={setProxyPass}
                    disabled={busy}
                    trailing={
                      <button
                        type="button"
                        onClick={() => setShowProxyPass((s) => !s)}
                        disabled={busy}
                        className="flex w-10 flex-none items-center justify-center border-l border-border text-muted-foreground transition-colors hover:text-foreground"
                        aria-label={showProxyPass ? t('common.hidePassword') : t('common.showPassword')}
                      >
                        {showProxyPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    }
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {t('screens.instagramAccounts.proxyHint')}
                </p>
              </div>
            ) : null}
          </div>
        ) : null}

        {mode === 'bulk' ? (
          <div className="space-y-3">
            <div className="flex items-stretch border border-border">
              <button
                type="button"
                onClick={() => setBulkInput('paste')}
                disabled={busy}
                className={cn(
                  'inline-flex h-9 flex-1 items-center justify-center gap-1.5 border-r border-border px-3 text-xs font-medium transition-colors',
                  bulkInput === 'paste'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-background text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <FileUp className="h-3.5 w-3.5" />
                {t('screens.instagramAccounts.pasteCsv')}
              </button>
              <button
                type="button"
                onClick={() => setBulkInput('file')}
                disabled={busy}
                className={cn(
                  'inline-flex h-9 flex-1 items-center justify-center gap-1.5 px-3 text-xs font-medium transition-colors',
                  bulkInput === 'file'
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-background text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                )}
              >
                <Upload className="h-3.5 w-3.5" />
                {t('screens.instagramAccounts.uploadFile')}
              </button>
            </div>

            <div className="border border-border bg-muted/30 p-3 text-xs">
              <div className="mb-1 font-medium">{t('screens.instagramAccounts.expectedColumns')}</div>
              <code className="block font-mono text-[11px] text-muted-foreground">{BULK_TEMPLATE}</code>
              <div className="mt-1 text-muted-foreground">
                {t('screens.instagramAccounts.proxyFieldsOptional')}<code>http://host:port</code>{t('screens.instagramAccounts.proxyFieldsOr')}
                <code>socks5://host:port</code>{t('screens.instagramAccounts.proxyFieldsTrailing')}
              </div>
            </div>

            {bulkInput === 'paste' ? (
              <Textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`username,password,proxy_url,proxy_username,proxy_password\nalice,secret123,,,\nbob,hunter2,http://proxy.io:8080,bob,proxypass`}
                rows={6}
                disabled={busy}
                className="font-mono text-xs"
              />
            ) : (
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-border p-6 text-sm text-muted-foreground hover:bg-accent">
                <Upload className="h-6 w-6" />
                <span>
                  {bulkFileName
                    ? t('screens.instagramAccounts.selectedFile', { name: bulkFileName })
                    : t('screens.instagramAccounts.chooseFileHint')}
                </span>
                <input
                  type="file"
                  accept=".csv,.txt,.xlsx,.xls"
                  className="hidden"
                  disabled={busy}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                  }}
                />
              </label>
            )}

            {bulkParsed.length > 0 ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {t('screens.instagramAccounts.validRowsCount', { count: validRows.length })}
                  </span>
                  {errorRows.length > 0 ? (
                    <span className="font-medium text-destructive">
                      {t('screens.instagramAccounts.invalidRowsCount', { count: errorRows.length })}
                    </span>
                  ) : null}
                </div>
                <div className="max-h-40 overflow-auto border border-border">
                  <table className="w-full whitespace-nowrap text-xs">
                    <thead className="bg-muted/40">
                      <tr>
                        <th className="px-2 py-1 text-left font-medium">#</th>
                        <th className="px-2 py-1 text-left font-medium">{t('screens.instagramAccounts.tableUsername')}</th>
                        <th className="px-2 py-1 text-left font-medium">{t('screens.instagramAccounts.tableProxy')}</th>
                        <th className="px-2 py-1 text-left font-medium">{t('screens.instagramAccounts.tableStatus')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkParsed.slice(0, 50).map((r) => (
                        <tr key={r.rowNumber} className="border-t border-border even:bg-muted/30 last:border-b">
                          <td className="px-2 py-1 text-muted-foreground">{r.rowNumber}</td>
                          <td className="px-2 py-1 font-mono">{r.username || '—'}</td>
                          <td className="px-2 py-1 font-mono text-muted-foreground">
                            {r.proxyUrl ?? '—'}
                          </td>
                          <td className="px-2 py-1">
                            {r.error ? (
                              <span className="text-destructive">{r.error}</span>
                            ) : (
                              <span className="text-emerald-600">{t('screens.instagramAccounts.rowOk')}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bulkParsed.length > 50 ? (
                    <div className="px-2 py-1 text-[11px] text-muted-foreground">
                      {t('screens.instagramAccounts.andMore', { count: bulkParsed.length - 50 })}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    </Dialog>
  );
}

interface BulkRow {
  username: string;
  password: string;
  proxyUrl?: string;
  proxyUsername?: string;
  proxyPassword?: string;
}

interface ParsedRow extends BulkRow {
  rowNumber: number;
  error?: string;
}

const BULK_TEMPLATE = 'username,password,proxy_url,proxy_username,proxy_password';

// Minimal CSV splitter: handles commas + double-quoted values. Embedded
// newlines inside quoted fields are not supported (we split by line first).
function splitCsvLine(line: string, rowNumber: number, t: (key: string, params?: Record<string, unknown>) => string): ParsedRow {
  const fields: string[] = [];
  let buf = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        buf += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        buf += ch;
      }
    } else if (ch === ',') {
      fields.push(buf);
      buf = '';
    } else if (ch === '"' && buf.length === 0) {
      inQuotes = true;
    } else {
      buf += ch;
    }
  }
  fields.push(buf);

  const [username, password, proxyUrl, proxyUsername, proxyPassword] = fields.map((f) => f.trim());
  const normalizedProxyUrl = proxyUrl ? normalizeProxyUrl(proxyUrl) : '';

  const row: ParsedRow = {
    rowNumber,
    username: username ?? '',
    password: password ?? '',
    proxyUrl: normalizedProxyUrl || undefined,
    proxyUsername: proxyUsername || undefined,
    proxyPassword: proxyPassword || undefined,
  };

  if (!row.username) row.error = 'Missing username';
  else if (!row.password) row.error = 'Missing password';
  else if (row.proxyUrl && !/^(https?|socks5):\/\/[^\s]+:\d+/.test(row.proxyUrl)) {
    row.error = 'Bad proxy URL format';
  }

  return row;
}

function parseBulkText(raw: string): ParsedRow[] {
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  if (lines.length === 0) return [];

  const first = lines[0]!.toLowerCase();
  const hasHeader = /username/.test(first) && /password/.test(first);
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines.map((line, i) => splitCsvLine(line, hasHeader ? i + 2 : i + 1));
}

export function InstagramAccounts() {
  const { accounts, loading } = useAccounts();
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [proxyTarget, setProxyTarget] = useState<AccountPublic | null>(null);
  const [proxyRemoveTarget, setProxyRemoveTarget] = useState<AccountPublic | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AccountPublic | null>(null);
  const [retryTarget, setRetryTarget] = useState<AccountPublic | null>(null);
  const [showLoginMethod, setShowLoginMethod] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filteredAccounts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accounts.filter((account) => {
      if (statusFilter !== 'all' && account.status !== statusFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        account.username,
        account.displayName ?? '',
        account.proxyUrl ?? '',
        account.proxyUsername ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [accounts, query, statusFilter]);

  async function handleStartManualLogin(proxy: ProxyInput | null) {
    setAdding(true);
    setAddError(null);
    setShowLoginMethod(false);
    try {
      await b2dm.accounts.startLogin(proxy ?? undefined);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Could not start login');
    } finally {
      setAdding(false);
    }
  }

  async function handleStartAutoLogin(
    username: string,
    password: string,
    proxy: ProxyInput | null
  ) {
    setAdding(true);
    setAddError(null);
    setShowLoginMethod(false);
    try {
      await b2dm.accounts.startAutoLogin(username, password, proxy ?? undefined);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Could not start login');
    } finally {
      setAdding(false);
    }
  }

  async function handleStartBulk(rows: BulkRow[]) {
    setAdding(true);
    setAddError(null);
    try {
      await b2dm.accounts.startBulkAutoLogin(rows);
    } catch (err) {
      setAddError(err instanceof Error ? err.message : 'Could not start bulk login');
      throw err;
    } finally {
      setAdding(false);
    }
  }

  function openLoginMethod() {
    setShowLoginMethod(true);
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <>
        <EmptyState
          icon={<Instagram className="h-10 w-10" />}
          title="No Instagram accounts yet"
          description="Link an Instagram account to start sending DMs or scraping usernames."
          action={
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={openLoginMethod}
                disabled={adding}
                data-demo-id="add-account-button"
                className="inline-flex h-9 items-center gap-1.5 border border-border bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                {adding ? 'Working…' : 'Add account'}
              </button>
              {addError ? <p className="text-xs text-destructive">{addError}</p> : null}
            </div>
          }
        />
        {showLoginMethod ? (
          <AddAccountDialog
            onClose={() => setShowLoginMethod(false)}
            onChooseManual={handleStartManualLogin}
            onChooseAuto={handleStartAutoLogin}
            onStartBulk={handleStartBulk}
          />
        ) : null}
      </>
    );
  }

  return (
    <div className="flex h-full flex-col">
        <div className="flex items-stretch bg-background">
          <button
            type="button"
            onClick={openLoginMethod}
            disabled={adding}
            data-demo-id="add-account-button"
            className="inline-flex h-9 items-center gap-1.5 border-r border-border bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            {adding ? 'Working…' : 'Add account'}
          </button>
          <div className="relative min-w-0 flex-1 border-r border-border bg-background">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by username, name or proxy…"
              className="h-9 w-full bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          {STATUS_FILTERS.map((option, idx) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatusFilter(option.value)}
              className={cn(
                'h-9 px-3 text-xs font-medium transition-colors',
                idx !== STATUS_FILTERS.length - 1 && 'border-r border-border',
                statusFilter === option.value
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-background text-muted-foreground hover:bg-accent/50'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        {filteredAccounts.length === 0 ? (
          <div className="flex min-h-0 flex-1 items-center justify-center border-t border-border">
            <EmptyState
              icon={<Search className="h-10 w-10" />}
              title="No accounts match your filters"
              description="Adjust your search or status filter to find the account you're looking for."
            />
          </div>
        ) : (
          <div className="min-h-0 flex-1 overflow-auto">
            <table className="w-full whitespace-nowrap border-collapse text-left">
              <thead className="sticky top-0 z-10 border-t border-border bg-muted text-[11px] font-medium uppercase  text-muted-foreground">
                <tr>
                  <th className="px-3 py-1.5 text-left">Account</th>
                  <th className="px-3 py-1.5 text-left">Status</th>
                  <th className="px-3 py-1.5 text-left">Proxy</th>
                  <th className="px-3 py-1.5 text-right">Updated</th>
                  <th className="px-2 py-1.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <AccountRow
                    key={account.id}
                    account={account}
                    onDelete={() => setDeleteTarget(account)}
                    onConfigureProxy={() => setProxyTarget(account)}
                    onRetry={() => setRetryTarget(account)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

      {proxyTarget ? (
        <ProxyDialog
          account={proxyTarget}
          onClose={() => setProxyTarget(null)}
          onRequestRemove={() => {
            setProxyRemoveTarget(proxyTarget);
            setProxyTarget(null);
          }}
        />
      ) : null}
      {proxyRemoveTarget ? (
        <ConfirmRemoveProxyDialog
          account={proxyRemoveTarget}
          onClose={() => setProxyRemoveTarget(null)}
        />
      ) : null}
      {deleteTarget ? (
        <ConfirmDeleteDialog account={deleteTarget} onClose={() => setDeleteTarget(null)} />
      ) : null}
      {retryTarget ? (
        <RetryLoginDialog account={retryTarget} onClose={() => setRetryTarget(null)} />
      ) : null}
      {showLoginMethod ? (
        <AddAccountDialog
          onClose={() => setShowLoginMethod(false)}
          onChooseManual={handleStartManualLogin}
          onChooseAuto={handleStartAutoLogin}
          onStartBulk={handleStartBulk}
        />
      ) : null}
    </div>
  );
}
