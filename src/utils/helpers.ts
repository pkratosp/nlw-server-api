//converte a hora em minuto para salvar no banco
export function converHoursInMinutes(hourString: string){
    const [hours, minutes] = hourString.split(':').map(Number)

    const MinutisTotal = hours * 60 + minutes
    return MinutisTotal
}

//converte os minutos da minha hora em hora formatada
export function convertMinutesAndHours(minutesAmount: number){
    const hours = Math.floor(minutesAmount / 60) //converte minha hora
    const minutes = minutesAmount % 60

    //esse mano String(hours).padStart(2,'0'), vai simplesmente verificar se tem somente um 0, se isso for verdade ele ira adicionar dois zeros
    return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}`
}