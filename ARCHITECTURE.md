# Clean Architecture Documentation

## 🎯 Arsitektur yang Digunakan

### Clean Architecture (Robert C. Martin)
Memisahkan concerns ke dalam layers yang independent:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (React Components, Hooks, UI)        │
├─────────────────────────────────────────┤
│       Infrastructure Layer              │
│  (API Calls, DI Container, Repos)       │
├─────────────────────────────────────────┤
│        Application Layer                │
│        (Use Cases, Business Rules)      │
├─────────────────────────────────────────┤
│          Domain Layer                   │
│    (Entities, Interfaces, Core Logic)   │
└─────────────────────────────────────────┘
```

### Atomic Design Pattern (Brad Frost)
Hierarchical component structure:

```
Pages (app/page.tsx)
    ↓
Templates (DashboardTemplate)
    ↓
Organisms (Sidebar, Header, Sections)
    ↓
Molecules (MetricCard, ActivityItem)
    ↓
Atoms (Icon, Badge)
```

## 📋 Layer Details

### 1. Domain Layer (`src/domain/`)
**Purpose**: Core business logic, framework-agnostic

**Files**:
- `entities/Dashboard.ts`: Business entities dan methods
- `repositories/IDashboardRepository.ts`: Repository interface

**Rules**:
- ❌ NO framework dependencies
- ❌ NO external library imports
- ✅ Pure TypeScript/JavaScript
- ✅ Business rules only

**Example**:
```typescript
export class Dashboard {
  getTotalProjects(): number {
    return this.projectStatuses.reduce((sum, status) => sum + status.count, 0);
  }
}
```

### 2. Application Layer (`src/application/`)
**Purpose**: Application-specific business rules

**Files**:
- `use-cases/GetDashboardData.ts`: Orchestrate business operations

**Rules**:
- ✅ Can import from Domain layer
- ❌ NO framework-specific code
- ✅ Pure business logic
- ✅ Testable without UI

**Example**:
```typescript
export class GetDashboardDataUseCase {
  async execute(): Promise<Dashboard> {
    return await this.dashboardRepository.getDashboardData();
  }
}
```

### 3. Infrastructure Layer (`src/infrastructure/`)
**Purpose**: Technical implementation details

**Files**:
- `repositories/DashboardRepository.ts`: Data fetching implementation
- `di/container.ts`: Dependency injection setup

**Rules**:
- ✅ Implements Domain interfaces
- ✅ Can use external libraries
- ✅ API calls, database, cache
- ✅ Framework integrations

**Example**:
```typescript
export class DashboardRepository implements IDashboardRepository {
  async getDashboardData(): Promise<Dashboard> {
    // API call or mock data
    const response = await fetch('/api/dashboard');
    return new Dashboard(...);
  }
}
```

### 4. Presentation Layer (`src/presentation/`)
**Purpose**: User interface and interactions

**Structure**:
```
presentation/
├── hooks/              # Custom React hooks
│   └── useDashboard.ts
└── components/
    ├── atoms/         # Basic building blocks
    ├── molecules/     # Simple combinations
    ├── organisms/     # Complex sections
    └── templates/     # Page layouts
```

**Rules**:
- ✅ React-specific code
- ✅ Use hooks for state
- ✅ Import from all layers
- ✅ UI/UX concerns only

## 🔄 Data Flow

```
User Action
    ↓
Component (Presentation)
    ↓
Custom Hook (useDashboard)
    ↓
DI Container (Infrastructure)
    ↓
Use Case (Application)
    ↓
Repository (Infrastructure)
    ↓
Entity (Domain)
    ↓
Back to Component
```

**Example Flow**:
1. User opens dashboard page (`app/page.tsx`)
2. `useDashboard` hook is called
3. Hook gets use case from DI container
4. Use case calls repository method
5. Repository fetches/creates Dashboard entity
6. Entity returned through layers
7. Component renders with data

## 🧩 Component Hierarchy

### Atoms (Smallest)
- **Icon**: SVG icons
- **Badge**: Percentage indicators

**Characteristics**:
- Single responsibility
- Highly reusable
- No business logic
- Style-focused

### Molecules
- **MetricCard**: Icon + Badge + Text
- **ActivityItem**: Icon + Text + Timestamp
- **ProjectStatusChart**: Multiple bars

**Characteristics**:
- Combine 2-5 atoms
- Single purpose
- Reusable across pages
- Minimal state

### Organisms
- **Sidebar**: Logo + Navigation + Profile
- **DashboardHeader**: Title + Search + Actions
- **MetricsGrid**: Multiple MetricCards
- **ProjectStatusSection**: Header + Chart + Dropdown
- **RecentActivitySection**: Header + Multiple ActivityItems

**Characteristics**:
- Combine molecules & atoms
- Complex functionality
- May have local state
- Page-specific sometimes

### Templates
- **DashboardTemplate**: Complete page layout
- **LoadingTemplate**: Loading state UI
- **ErrorTemplate**: Error state UI

**Characteristics**:
- Full page structure
- No hardcoded data
- Receive props for content
- Define layout grid

### Pages
- **app/page.tsx**: Entry point

**Characteristics**:
- Next.js file-based routing
- Data fetching
- Pass data to templates
- Handle states (loading, error)

## 🎨 Design Principles

### SOLID Principles

**S - Single Responsibility**
- Each class/component has one job
- `MetricCard` only displays metrics
- `GetDashboardDataUseCase` only fetches data

**O - Open/Closed**
- Open for extension, closed for modification
- Add new metrics without changing existing code

**L - Liskov Substitution**
- Repository can be swapped (Mock ↔ API)
- Won't break the application

**I - Interface Segregation**
- Small, specific interfaces
- `IDashboardRepository` has clear contract

**D - Dependency Inversion**
- Depend on abstractions, not implementations
- Use cases depend on interfaces, not concrete repos

### Additional Patterns

**Repository Pattern**
- Abstracts data access
- Easy to test with mocks
- Swap data sources easily

**Dependency Injection**
- Centralized dependency management
- Easy to test
- Loose coupling

**Custom Hooks**
- Encapsulate stateful logic
- Reusable across components
- Testable independently

## 🧪 Testing Strategy

### Unit Tests
```typescript
// Domain entities
test('Dashboard.getTotalProjects calculates correctly', () => {
  const dashboard = new Dashboard(...);
  expect(dashboard.getTotalProjects()).toBe(84);
});

// Use cases
test('GetDashboardDataUseCase fetches data', async () => {
  const useCase = new GetDashboardDataUseCase(mockRepo);
  const result = await useCase.execute();
  expect(result).toBeInstanceOf(Dashboard);
});
```

### Integration Tests
```typescript
// Repository with API
test('DashboardRepository fetches from API', async () => {
  const repo = new DashboardRepository();
  const result = await repo.getDashboardData();
  expect(result.metrics).toHaveLength(4);
});
```

### Component Tests
```typescript
// React components
test('MetricCard renders correctly', () => {
  render(<MetricCard metric={mockMetric} />);
  expect(screen.getByText('Total Users')).toBeInTheDocument();
});
```

## 📈 Scalability

### Adding New Features

**1. Add New Metric**
```typescript
// 1. Update Domain Entity
interface DashboardMetric {
  // existing fields...
  trend: 'up' | 'down' | 'stable';
}

// 2. Update Repository
async getDashboardData(): Promise<Dashboard> {
  // add new metric data
}

// 3. UI updates automatically via existing components
```

**2. Add New Page**
```
1. Create domain entities
2. Create use case
3. Create repository implementation
4. Create components (atoms → templates)
5. Create page in app/
```

**3. Change Data Source**
```typescript
// Only modify Infrastructure layer
class APIRepository implements IDashboardRepository {
  async getDashboardData(): Promise<Dashboard> {
    const response = await fetch(process.env.API_URL);
    return transform(response);
  }
}

// Update DI container
this.dashboardRepository = new APIRepository();
```

## 🔧 Best Practices

### File Naming
- PascalCase for components: `MetricCard.tsx`
- camelCase for hooks: `useDashboard.ts`
- PascalCase for classes: `Dashboard.ts`
- Interface prefix: `IDashboardRepository.ts`

### Folder Structure
- Group by feature/layer, not by type
- Co-locate related files
- Clear separation of concerns

### Code Style
```typescript
// ✅ Good: Documented component
/**
 * Molecule Component: MetricCard
 * Displays a single metric with icon, value, and change percentage
 */
export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  // implementation
};

// ❌ Bad: No documentation
export const MetricCard = ({ metric }) => {
  // implementation
};
```

### TypeScript
```typescript
// ✅ Good: Strong typing
interface MetricCardProps {
  metric: DashboardMetric;
}

// ❌ Bad: Any type
const MetricCard = ({ metric }: any) => {
```

## 🎓 Learning Resources

### Clean Architecture
- Book: "Clean Architecture" by Robert C. Martin
- Blog: https://blog.cleancoder.com/

### Atomic Design
- Book: "Atomic Design" by Brad Frost
- Website: https://atomicdesign.bradfrost.com/

### React Best Practices
- Official Docs: https://react.dev/
- Patterns: https://reactpatterns.com/

### TypeScript
- Handbook: https://www.typescriptlang.org/docs/

## 📝 Checklist untuk Development

- [ ] Entities tidak import framework
- [ ] Use cases pure business logic
- [ ] Repository implement interface
- [ ] Components documented
- [ ] Props typed dengan interface
- [ ] Atomic structure diikuti
- [ ] No hardcoded data in components
- [ ] Custom hooks untuk state management
- [ ] Error handling implemented
- [ ] Loading states handled
- [ ] Responsive design
- [ ] Accessibility considerations

---

**Dokumentasi ini menjelaskan arsitektur yang digunakan dalam project Nexus Admin Dashboard**
