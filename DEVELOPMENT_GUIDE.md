# Development Guide - Nexus Admin Dashboard

## 🚀 Quick Start

### 1. Installation
```bash
cd /Users/macbook/Documents/Website/ikibisnis
pnpm install
```

### 2. Run Development Server
```bash
pnpm dev
```
Dashboard akan berjalan di: **http://localhost:3000**

### 3. Build for Production
```bash
pnpm build
pnpm start
```

## 📖 Common Tasks

### Task 1: Menambah Metric Baru

**Contoh: Tambah "Active Customers" metric**

#### Step 1: Update Domain Entity
```typescript
// src/domain/entities/Dashboard.ts
export interface DashboardMetric {
  value: number;
  label: string;
  change: number;
  icon: string;
  color: 'blue' | 'red' | 'green' | 'orange' | 'purple'; // Tambah purple
}
```

#### Step 2: Update Repository
```typescript
// src/infrastructure/repositories/DashboardRepository.ts
async getDashboardData(): Promise<Dashboard> {
  const metrics: DashboardMetric[] = [
    // ... existing metrics
    {
      value: 3245,
      label: 'Active Customers',
      change: 8.3,
      icon: 'users',
      color: 'purple'
    }
  ];
  // ...
}
```

#### Step 3: Update Icon Component (jika perlu icon baru)
```typescript
// src/presentation/components/atoms/Icon.tsx
// Icons sudah ada, jika perlu tambahkan icon baru
```

#### Step 4: Update Color Mapping (jika perlu)
```typescript
// src/presentation/components/molecules/MetricCard.tsx
const colorClasses = {
  // ... existing colors
  purple: 'bg-purple-500/10 text-purple-400',
};

const progressColors = {
  // ... existing colors
  purple: 'bg-purple-500',
};
```

**Selesai!** Dashboard otomatis menampilkan metric baru. ✅

---

### Task 2: Menambah Activity Type Baru

**Contoh: Tambah "Comment" activity type**

#### Step 1: Update Domain Entity
```typescript
// src/domain/entities/Dashboard.ts
export interface Activity {
  id: string;
  type: 'payment' | 'user' | 'warning' | 'archive' | 'comment'; // Tambah comment
  title: string;
  description: string;
  timestamp: Date;
}
```

#### Step 2: Update Repository
```typescript
// src/infrastructure/repositories/DashboardRepository.ts
const recentActivities: Activity[] = [
  // ... existing activities
  {
    id: '5',
    type: 'comment',
    title: 'New comment received',
    description: 'John commented on Project Alpha',
    timestamp: new Date(Date.now() - 30 * 60 * 1000)
  }
];
```

#### Step 3: Update ActivityItem Component
```typescript
// src/presentation/components/molecules/ActivityItem.tsx
const iconBgColors = {
  // ... existing colors
  comment: 'bg-purple-500/10 text-purple-400',
};

const iconNames = {
  // ... existing icons
  comment: 'users', // atau buat icon baru
};
```

**Done!** Activity baru muncul di recent activity list. ✅

---

### Task 3: Menambah Menu Sidebar Baru

**Contoh: Tambah menu "Analytics"**

#### Update Sidebar Component
```typescript
// src/presentation/components/organisms/Sidebar.tsx
const menuItems = [
  { name: 'Dashboard', icon: 'grid' },
  { name: 'Users', icon: 'users' },
  { name: 'Projects', icon: 'briefcase' },
  { name: 'Analytics', icon: 'chart' }, // ⬅️ Tambah ini
  { name: 'Finance', icon: 'credit' },
  { name: 'Settings', icon: 'settings' }
];
```

#### Tambah Icon (jika perlu)
```typescript
// src/presentation/components/atoms/Icon.tsx
const icons: Record<string, React.ReactElement> = {
  // ... existing icons
  chart: (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};
```

**Done!** Menu baru muncul di sidebar. ✅

---

### Task 4: Connect ke Real API

**Mengganti mock data dengan API call**

#### Step 1: Update Repository Implementation
```typescript
// src/infrastructure/repositories/DashboardRepository.ts
export class DashboardRepository implements IDashboardRepository {
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async getDashboardData(): Promise<Dashboard> {
    try {
      // Ganti mock dengan real API call
      const response = await fetch(`${this.apiUrl}/api/dashboard`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const data = await response.json();

      // Transform API response ke Dashboard entity
      const metrics: DashboardMetric[] = data.metrics.map((m: any) => ({
        value: m.value,
        label: m.label,
        change: m.changePercentage,
        icon: this.mapIconName(m.iconType),
        color: this.mapColor(m.colorType),
      }));

      const projectStatuses: ProjectStatus[] = data.projectStatuses;
      const recentActivities: Activity[] = data.activities.map((a: any) => ({
        ...a,
        timestamp: new Date(a.timestamp),
      }));

      return new Dashboard(metrics, projectStatuses, recentActivities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to mock data jika API gagal
      return this.getMockData();
    }
  }

  private mapIconName(iconType: string): string {
    const mapping: Record<string, string> = {
      'user': 'users',
      'project': 'rocket',
      'money': 'dollar',
      'expense': 'cart',
    };
    return mapping[iconType] || 'grid';
  }

  private mapColor(colorType: string): 'blue' | 'red' | 'green' | 'orange' {
    const mapping: Record<string, any> = {
      'primary': 'blue',
      'danger': 'red',
      'success': 'green',
      'warning': 'orange',
    };
    return mapping[colorType] || 'blue';
  }

  private getMockData(): Dashboard {
    // Existing mock data implementation
    // ...
  }
}
```

#### Step 2: Add Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

#### Step 3: Test
```bash
pnpm dev
```

**Done!** Dashboard sekarang menggunakan real API. ✅

---

### Task 5: Tambah Loading Skeleton

**Membuat loading state yang lebih bagus**

#### Create Skeleton Component
```typescript
// src/presentation/components/atoms/Skeleton.tsx
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-700/50 rounded ${className}`} />
  );
};
```

#### Update MetricCard with Skeleton
```typescript
// src/presentation/components/molecules/MetricCard.tsx
import { Skeleton } from '../atoms/Skeleton';

export const MetricCardSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-start justify-between mb-4">
        <Skeleton className="w-12 h-12 rounded-lg" />
        <Skeleton className="w-16 h-6" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-32 h-8" />
        <Skeleton className="w-full h-2 rounded-full" />
      </div>
    </div>
  );
};
```

#### Update Loading Template
```typescript
// src/presentation/components/templates/LoadingTemplate.tsx
import { MetricCardSkeleton } from '../molecules/MetricCard';
import { Sidebar } from '../organisms/Sidebar';

export const LoadingTemplate: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-slate-700/50 rounded mb-2"></div>
            <div className="h-4 w-96 bg-slate-700/50 rounded"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
      </main>
    </div>
  );
};
```

**Done!** Loading state sekarang lebih smooth. ✅

---

## 🎨 Customization

### Change Theme Colors

Edit Tailwind CSS di `app/globals.css`:

```css
@layer base {
  body {
    @apply bg-slate-900 text-white antialiased;
    /* Ganti slate-900 dengan warna lain, misal: bg-gray-900, bg-zinc-900 */
  }
}
```

### Change Font

Edit `app/layout.tsx`:

```typescript
import { Inter, Roboto } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Gunakan di HTML
<html lang="en" className={inter.variable}>
```

### Adjust Sidebar Width

Edit `src/presentation/components/organisms/Sidebar.tsx`:

```typescript
// Ganti w-64 (256px) ke ukuran lain
<aside className="w-72 bg-slate-900/50 ...">

// Jangan lupa update margin di template
// src/presentation/components/templates/DashboardTemplate.tsx
<main className="flex-1 ml-72 p-8">
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Dashboard loads without errors
- [ ] All metrics display correctly
- [ ] Chart shows all project statuses
- [ ] Activity list is scrollable
- [ ] Sidebar navigation is clickable
- [ ] Search input is functional
- [ ] Responsive on mobile
- [ ] Dark mode looks good
- [ ] Loading state shows properly
- [ ] Error state can retry

### Add Unit Tests (Optional)

```bash
# Install testing dependencies
pnpm add -D @testing-library/react @testing-library/jest-dom jest
```

Create test file:
```typescript
// src/domain/entities/__tests__/Dashboard.test.ts
import { Dashboard } from '../Dashboard';

describe('Dashboard Entity', () => {
  it('should calculate total projects correctly', () => {
    const dashboard = new Dashboard([], mockStatuses, []);
    expect(dashboard.getTotalProjects()).toBe(84);
  });
});
```

---

## 🐛 Troubleshooting

### Issue: Module not found
```bash
# Clear Next.js cache
rm -rf .next
pnpm dev
```

### Issue: TypeScript errors
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: Styles not applying
```bash
# Check Tailwind config
# Make sure globals.css is imported in layout.tsx
```

### Issue: Dashboard not loading
1. Check browser console for errors
2. Verify all imports are correct
3. Check DI container initialization
4. Verify repository returns correct data

---

## 📚 Further Reading

- [Clean Architecture](./ARCHITECTURE.md) - Detailed architecture explanation
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 💡 Tips

1. **Keep components small**: Max 200 lines per file
2. **Type everything**: Avoid `any` type
3. **Document complex logic**: Add JSDoc comments
4. **Test before deploy**: Check all features work
5. **Follow patterns**: Consistency is key

---

**Happy coding! 🚀**

Jika ada pertanyaan, silakan tambahkan issue atau dokumentasi lebih lanjut.
