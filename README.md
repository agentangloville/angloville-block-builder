# Angloville Block Builder

Generuj gotowy kod ACF bloków WordPress dla landing page'ów Angloville.

## Jak to działa

1. Wybierasz **rynek** (angloville.pl / .com / .it / .com.br)
2. Wybierasz **język** treści
3. Opcjonalnie wybierasz **bloki** i ich kolejność
4. Piszesz **prompt** opisujący stronę
5. Claude API dobiera bloki, wypełnia je treścią i zwraca gotowy kod
6. **Kopiujesz** kod i wklejasz w WordPress Code Editor

## Deploy na Vercel

### 1. Push do GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/angloville-block-builder.git
git push -u origin main
```

### 2. Import w Vercel

1. Wejdź na [vercel.com](https://vercel.com) → **Add New Project**
2. Import z GitHub → wybierz repo `angloville-block-builder`
3. Framework: **Next.js** (auto-detected)
4. **Environment Variables** → dodaj:
   - `ANTHROPIC_API_KEY` = twój klucz API z [console.anthropic.com](https://console.anthropic.com)
   - `APP_PIN` = 4-cyfrowy PIN do logowania (np. `2137`)
5. **Deploy**

### 3. Gotowe!

Aplikacja będzie dostępna pod `your-project.vercel.app`

## Biblioteka bloków

Aplikacja ma wbudowaną bibliotekę tych bloków ACF:

| Blok | Opis |
|------|------|
| `block-banner` | Hero banner z tytułem, subtytułem, CTA |
| `block-text` | Tekst 50/50 (tytuł + opis) |
| `block-video` | YouTube / self-hosted video |
| `block-icons` | Ikony/features z opisami |
| `block-courses` | Karty programów/kursów |
| `block-plan` | Timeline / harmonogram dnia |
| `block-table` | Tabela do 4 kolumn |
| `block-faq` | FAQ accordion |
| `block-form` | Formularz lead gen |
| `block-opinions` | Opinie uczestników |
| `block-gallery` | Galeria zdjęć |
| `block-numbers` | Statystyki / liczby |
| `block-cta` | Call-to-action |
| `block-instagram` | Instagram feed |

## Dodawanie nowych bloków

Edytuj `lib/blocks-library.ts` — dodaj nowy blok do obiektu `BLOCKS_LIBRARY` z:
- `name` — nazwa ACF bloku (np. `acf/block-newblock`)
- `description` — co robi blok
- `acfFields` — struktura pól
- `exampleOutput` — przykładowy output

Potem dodaj block do tablicy `BLOCKS` w `app/page.tsx`.

## Stack

- **Next.js 14** (App Router)
- **Claude API** (claude-sonnet-4-20250514)
- **Vercel** (hosting + serverless)
