import type { LucideIcon } from 'lucide-react'
import {
  BaggageClaim,
  BookOpen,
  BriefcaseBusiness,
  CarFront,
  Dumbbell,
  Gift,
  HeartPulse,
  House,
  Mailbox,
  PawPrint,
  PiggyBank,
  ReceiptText,
  ShoppingCart,
  Ticket,
  ToolCase,
  Utensils,
} from '@/components/icons'
import type { CategoryColor, CategoryIcon } from '@/types/finance'

export const categoryColorClasses: Record<
  CategoryColor,
  { badge: string; icon: string; text: string; swatch: string; label: string }
> = {
  green: {
    badge: 'bg-green-light text-green-dark',
    icon: 'bg-green-light text-green-base',
    text: 'text-green-base',
    swatch: 'bg-green-base',
    label: 'Verde',
  },
  blue: {
    badge: 'bg-blue-light text-blue-dark',
    icon: 'bg-blue-light text-blue-base',
    text: 'text-blue-base',
    swatch: 'bg-blue-base',
    label: 'Azul',
  },
  purple: {
    badge: 'bg-purple-light text-purple-dark',
    icon: 'bg-purple-light text-purple-base',
    text: 'text-purple-base',
    swatch: 'bg-purple-base',
    label: 'Roxo',
  },
  pink: {
    badge: 'bg-pink-light text-pink-dark',
    icon: 'bg-pink-light text-pink-base',
    text: 'text-pink-base',
    swatch: 'bg-pink-base',
    label: 'Rosa',
  },
  red: {
    badge: 'bg-red-light text-red-dark',
    icon: 'bg-red-light text-red-base',
    text: 'text-red-base',
    swatch: 'bg-red-base',
    label: 'Vermelho',
  },
  orange: {
    badge: 'bg-orange-light text-orange-dark',
    icon: 'bg-orange-light text-orange-base',
    text: 'text-orange-base',
    swatch: 'bg-orange-base',
    label: 'Laranja',
  },
  yellow: {
    badge: 'bg-yellow-light text-yellow-dark',
    icon: 'bg-yellow-light text-yellow-base',
    text: 'text-yellow-base',
    swatch: 'bg-yellow-base',
    label: 'Amarelo',
  },
}

export const categoryIcons: Record<CategoryIcon, { icon: LucideIcon; label: string }> = {
  briefcase: { icon: BriefcaseBusiness, label: 'Trabalho' },
  car: { icon: CarFront, label: 'Carro' },
  'heart-pulse': { icon: HeartPulse, label: 'Saúde' },
  'piggy-bank': { icon: PiggyBank, label: 'Investimento' },
  'shopping-cart': { icon: ShoppingCart, label: 'Mercado' },
  ticket: { icon: Ticket, label: 'Entretenimento' },
  'tool-case': { icon: ToolCase, label: 'Utilidades' },
  utensils: { icon: Utensils, label: 'Alimentação' },
  'paw-print': { icon: PawPrint, label: 'Pets' },
  house: { icon: House, label: 'Casa' },
  gift: { icon: Gift, label: 'Presentes' },
  dumbbell: { icon: Dumbbell, label: 'Academia' },
  'book-open': { icon: BookOpen, label: 'Educação' },
  'baggage-claim': { icon: BaggageClaim, label: 'Viagem' },
  mailbox: { icon: Mailbox, label: 'Contas' },
  receipt: { icon: ReceiptText, label: 'Impostos' },
}

export const categoryIconOptions = Object.keys(categoryIcons) as CategoryIcon[]
export const categoryColorOptions = Object.keys(categoryColorClasses) as CategoryColor[]
