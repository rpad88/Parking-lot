let  itemForStorage = JSON.parse(localStorage.getItem("Park:Plates")) || []

const form = document.querySelector("form")
form.addEventListener("submit", (e) => {
    e.preventDefault()

        let car = Form.getValues()
        
        Car.checkIn(car)
        
        Storage.save(car);
 
})

// Storage
const Storage = {
   
    getSaved(){
        return console.log(JSON.parse(localStorage.getItem("Park:Plates")))
    },

    set() {
        localStorage.setItem("Park:Plates", JSON.stringify(itemForStorage))
    },
    
    save(car) {
        itemForStorage.push(car)
        console.log(itemForStorage);
        localStorage.setItem("Park:Plates", JSON.stringify(itemForStorage))
        // localStorage.setItem("Park:Plates", JSON.stringify(car))
    },
    
}


const Form = {
    plate: document.querySelector('[data-plate]'),
    brand: document.querySelector('[data-brand]'),
    model: document.querySelector('[data-model]'),
    checkIn() {
        let hours = new Date().getHours()
        let minutes = new Date().getMinutes()

        return `${(hours < 10 ? "0" : "") + hours}:${(minutes < 10 ? "0" : "") + minutes}`
    },
    getValues() {

        if(!this.plate.value || !this.brand.value || !this.model.value) {
            throw new Error("Please fill all fields")            
        }
        return {
            plate: Form.plate.value,
            brand: Form.brand.value,
            model: Form.model.value,
            checkIn: Form.checkIn(),
            checkOut: null,
            income: null,
        }
    },
    clear() {
        Form.plate.value = "",
        Form.brand.value = "",
        Form.model.value = ""
    }
}


const Car = {
    checkIn(car) {
        let table = document.querySelector('[data-table]')
        let tr = document.createElement('tr')
        let data = `
                        <tr>
                            <td>${car.brand}</td>
                            <td>${car.model}</td>
                            <td data-plate>${car.plate}</td>
                            <td>${car.checkIn}</td>
                            <td data-checkout></td>
                            <td data-cost></td>
                            <td class="actions">
                                <span class="payment">&dollar;</span>
                                <span class="del">&Cross;</span>
                            </td>
                        </tr>
                    `;
        tr.innerHTML = data

        tr.querySelector('.payment').addEventListener('click', (e) => {
            tr.querySelector('[data-checkout]').textContent = Car.checkOut()
            
            tr.querySelector('[data-cost]').textContent = Car.calcCost(car)
        })

        tr.querySelector('.del').addEventListener('click', () => {
            let plate = tr.querySelector("[data-plate]").innerText

            Car.remove(plate)
            tr.remove()
        })
        
        table.appendChild(tr)
        Form.clear()
    },

    checkOut(car) {
        let hours = new Date().getHours()
        let minutes = new Date().getMinutes()

        return `${(hours < 10 ? "0" : "") + hours}:${(minutes < 10 ? "0" : "") + minutes}`
    },

    calcCost(car) {
        let checkIn = car.checkIn.split(":")
        let checkOut = Car.checkOut().split(":")

        let totalHours = +checkOut[0] - +checkIn[0]
        let totalMinutes = +checkOut[1] - +checkIn[1]
        let totalInMinutes = (totalHours * 60) + totalMinutes
        
        // R$ 5,00 for 1 hour and R$ 3,00 for extra hours
        let initialCost = 5
        console.log(totalInMinutes);

        if (totalInMinutes < 0) {
            let extraTime = ~~(totalInMinutes / 60)
            console.log(extraTime);
            extraTime += 24
            let total = initialCost + (extraTime * 3)
           
            console.log(`Total in minutes: ${totalInMinutes}
            Total in Hours: ${(totalInMinutes/60).toFixed(2)}`)

            return MoneyFormatter.format(total)
        }

        if (totalInMinutes <= 60 && totalInMinutes > 0) {
            return MoneyFormatter.format(initialCost)
        } else {
            // equals Math.floor(total minutes / 60)
            let extraTime = ~~(totalInMinutes / 60)
            let total = initialCost + (extraTime * 3)
           
            console.log(`Total in minutes: ${totalInMinutes}
            Total in Hours: ${(totalInMinutes/60).toFixed(2)}`)

            return MoneyFormatter.format(total)
        }
    },

    remove(plate) {
        let index = itemForStorage.findIndex(car => car.plate == plate)
        console.log(`placa pesquisada: ${plate}
        index encontrado: ${index}`);
        itemForStorage.splice(index, 1)
        Storage.set()
    }
    
}

var MoneyFormatter = new Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
})

const App = {
    init() {
      App.render()  
    },    // 

    render() {

        itemForStorage.forEach(car => {
            let table = document.querySelector('[data-table]')
            let tr = document.createElement('tr')
            let data = `
                            <tr>
                                <td>${car.brand}</td>
                                <td>${car.model}</td>
                                <td data-plate>${car.plate}</td>
                                <td>${car.checkIn}</td>
                                <td data-checkout>${car.checkOut = ""}</td>
                                <td data-cost></td>
                                <td class="actions">
                                    <span class="payment">&dollar;</span>
                                    <span class="del">&Cross;</span>
                                </td>
                            </tr>
                        `;
            tr.innerHTML = data

            tr.querySelector('.payment').addEventListener('click', (e) => {
                tr.querySelector('[data-checkout]').textContent = Car.checkOut()
                
                tr.querySelector('[data-cost]').textContent = Car.calcCost(car)
            })

            tr.querySelector('.del').addEventListener('click', () => {
                let plate = tr.querySelector("[data-plate]").innerText

                Car.remove(plate)
                tr.remove()
            })
            
            table.appendChild(tr)
        })        
    },
}

App.init()
