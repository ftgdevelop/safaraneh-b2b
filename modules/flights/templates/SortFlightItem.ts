import { FlightItemType } from "../types/flights";

export const SortHightestPrice = (a: FlightItemType,b: FlightItemType) => {
    if (a.adultPrice < b.adultPrice) return 1
    if (a.adultPrice > b.adultPrice) return -1
    return 0
}

export const SortCapacity = (a: FlightItemType, b: FlightItemType) => {
    if (a.capacity > b.capacity) return -1
    if (a.capacity < b.capacity) return 1
    return 0
}

export const SortTime = (a: FlightItemType, b: FlightItemType) => {
    let aHour: any = a.departureTime?.split('T')[1].split(':')[0]
    let aMinutes: any = a.departureTime?.split('T')[1].split(':')[1]
    if (aHour?.split('')[0] == 0) aHour = aHour.split('')[1]
    if (aMinutes?.split('')[0] == 0) aMinutes = aMinutes.split('')[1]

    let bHour: any = b.departureTime?.split('T')[1].split(':')[0]
    let bMinutes: any = b.departureTime?.split('T')[1].split(':')[1]
    if (bHour?.split('')[0] == 0) bHour = bHour.split('')[1]
    if (bMinutes?.split('')[0] == 0) bMinutes = bMinutes.split('')[1]
    
    if (+aHour > +bHour) return 1
    if (+aHour < +bHour) return -1
    if (+aHour == +bHour && +aMinutes > +bMinutes) return 1
    if (+aHour == +bHour && +aMinutes < +bMinutes) return -1
    if (+aHour == +bHour && +aMinutes == +bMinutes) return 1
    return 0
}