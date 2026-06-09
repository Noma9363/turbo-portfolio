import {categories} from '@/types/database'

interface SearchParamsInterface {
    search: PageInterface;
}
interface PageInterface {
    category : categories
}
export function Page({search}:SearchParamsInterface){

}