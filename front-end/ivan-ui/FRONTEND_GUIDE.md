# Frontend Development Guide - IVAN UI

## Tổng quan
Dự án sử dụng **shadcn/ui** với **Tailwind CSS** và hỗ trợ **Dark Mode** thông qua `next-themes`. Guide này giúp đảm bảo giao diện nhất quán và tương thích với cả light/dark mode.

## 🎨 Hệ thống màu sắc

### CSS Variables (globals.css)
```css
/* Light mode */
:root {
  --background: oklch(1 0 0);           /* Nền chính */
  --foreground: oklch(0.145 0 0);       /* Text chính */
  --card: oklch(1 0 0);                 /* Nền card */
  --primary: oklch(0.205 0 0);          /* Màu chính */
  --secondary: oklch(0.97 0 0);         /* Màu phụ */
  --muted: oklch(0.97 0 0);             /* Text mờ */
  --border: oklch(0.922 0 0);           /* Viền */
}

/* Dark mode */
.dark {
  --background: oklch(0.145 0 0);       /* Nền tối */
  --foreground: oklch(0.985 0 0);       /* Text sáng */
  --card: oklch(0.205 0 0);             /* Card tối */
  /* ... */
}
```

### Sử dụng màu sắc
✅ **ĐÚNG** - Sử dụng CSS variables:
```tsx
<div className="bg-background text-foreground">
<div className="bg-card border-border">
<Button className="bg-primary text-primary-foreground">
```

❌ **SAI** - Hardcode màu:
```tsx
<div className="bg-white text-black">        // Không tương thích dark mode
<div className="bg-gray-100">               // Không theo design system
```

## 🧩 Component Patterns

### 1. Button Components
```tsx
// Sử dụng variants có sẵn
<Button variant="default">Primary</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Subtle</Button>
<Button variant="destructive">Delete</Button>

// Custom styling với cn()
import { cn } from "@/lib/utils";
<Button className={cn("additional-classes", conditionalClass && "active")}>
```

### 2. Card Components
```tsx
<Card className="card-hover">  {/* Hover effect từ components.css */}
  <CardHeader>
    <CardTitle>Tiêu đề</CardTitle>
    <CardDescription>Mô tả</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Nội dung */}
  </CardContent>
</Card>
```

### 3. Status Badges
```tsx
// Sử dụng classes có sẵn từ components.css
<Badge className="status-active">Hoạt động</Badge>
<Badge className="status-inactive">Không hoạt động</Badge>
<Badge className="status-pending">Chờ xử lý</Badge>
```

## 🌙 Dark Mode Best Practices

### 1. Theme Toggle Implementation
```tsx
// Đã có sẵn trong ThemeToggle component
import { ThemeToggle } from "@/components/common/theme-toggle";

// Sử dụng trong Navbar
<ThemeToggle />
```

### 2. Conditional Styling
```tsx
// Sử dụng dark: prefix
<div className="bg-white dark:bg-gray-900 text-black dark:text-white">

// Hoặc sử dụng CSS variables (khuyến khích)
<div className="bg-background text-foreground">
```

### 3. Gradient Backgrounds với Dark Mode
```tsx
// Hero sections với gradient vibrant
<div className="bg-gradient-to-br from-violet-50 via-indigo-50 to-blue-50 dark:from-violet-950/40 dark:via-indigo-950/40 dark:to-blue-950/40">

// Filter sections
<div className="bg-gradient-to-r from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-950/30 dark:via-teal-950/30 dark:to-cyan-950/30">

// Stats sections
<div className="bg-gradient-to-r from-rose-50/80 via-pink-50/80 to-fuchsia-50/80 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-fuchsia-950/30">

// Text gradients
<h1 className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-violet-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
```

### 4. Icons và Images
```tsx
// Icons tự động thay đổi màu theo theme
<Sun className="h-4 w-4 text-foreground" />

// Conditional icons
<Sun className="block dark:hidden" />
<Moon className="hidden dark:block" />
```

## 📝 Quy tắc Styling

### 1. Thứ tự ưu tiên
1. **CSS Variables** (bg-background, text-foreground)
2. **Tailwind Classes** với dark: prefix
3. **Custom CSS** trong components.css
4. **Inline styles** (tránh nếu có thể)

### 2. Naming Convention
```css
/* components.css */
.component-variant { }     /* VD: .btn-gradient */
.status-type { }          /* VD: .status-active */
.utility-name { }         /* VD: .card-hover */
```

### 3. Gradient và Border Consistency
```tsx
// Borders với opacity
<div className="border border-gray-200/50 dark:border-gray-800/50">

// Backdrop blur cho glass effect
<div className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">

// Border radius nhất quán
<Card className="rounded-2xl">  // Cho cards lớn
<Button className="rounded-xl"> // Cho elements nhỏ hơn
```

### 4. Typography Scale
```tsx
// Hero titles responsive
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">

// Text gradients
<span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
```

### 5. Responsive Design
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<Button size="sm" className="md:size-default">
```

## 🔧 Common Components Usage

### Navigation
```tsx
// Navbar với theme toggle
<Navbar>
  <NavigationMenu>
    <NavigationMenuItem>
      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
        Dashboard
      </NavigationMenuLink>
    </NavigationMenuItem>
  </NavigationMenu>
  <ThemeToggle />
</Navbar>
```

### Forms
```tsx
<form className="space-y-4">
  <div>
    <Label>Tên</Label>
    <Input className="bg-background border-border" />
    <p className="form-error">Lỗi validation</p>
  </div>
  <Button type="submit">Lưu</Button>
</form>
```

### Loading States
```tsx
<div className="loading-spinner" />  {/* Từ components.css */}
<Skeleton className="h-4 w-full" />  {/* shadcn/ui skeleton */}
```

## ⚠️ Lưu ý quan trọng

1. **Luôn test cả light và dark mode** khi thêm component mới
2. **Sử dụng CSS variables** thay vì hardcode màu
3. **Import đúng components** từ `@/components/ui/`
4. **Sử dụng cn()** để merge classes an toàn
5. **Kiểm tra contrast** để đảm bảo accessibility
6. **Consistent spacing** với Tailwind spacing scale (4, 8, 12, 16...)

## 🚀 Quick Checklist

- [ ] Component có tương thích dark mode?
- [ ] Sử dụng đúng CSS variables?
- [ ] Import components từ đúng path?
- [ ] Responsive trên mobile/tablet?
- [ ] Accessibility (aria-labels, keyboard navigation)?
- [ ] Consistent với design system?

---

**Lưu ý**: Khi có thắc mắc về styling, hãy tham khảo:
- `src/styles/globals.css` - CSS variables
- `src/styles/components.css` - Custom utilities
- `src/components/ui/` - Base components
- `src/components/common/` - Common patterns