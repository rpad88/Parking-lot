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

    checkOut: "",

    getValues() {

        if(!this.plate.value || !this.brand.value || !this.model.value) {
            throw new Error("Please fill all fields")            
        }
        return {
            plate: Form.plate.value,
            brand: Form.brand.value,
            model: Form.model.value,
            checkIn: Form.checkIn(),
            checkOut: "",
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
                            <td></td>
                            <td class="actions">
                                <span class="payment">&dollar;</span>
                                <span class="del">&Cross;</span>
                            </td>
                        </tr>
                    `;
        tr.innerHTML = data

        tr.querySelector('.payment').addEventListener('click', (e) => {
            tr.querySelector('[data-checkout]').textContent = Car.checkOut()
        })

        tr.querySelector('.del').addEventListener('click', () => {
            
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
        // TODO fazer calculo de horas
        console.log(car.checkIn - car.checkOut);
    },

    remove(plate) {
        let index = itemForStorage.findIndex(car => car.plate == plate)
        console.log(`placa pesquisada: ${plate}
        index encontrado: ${index}`);
        itemForStorage.splice(index, 1)
        Storage.set()
    }
    
}

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
                Car.calcCost(car)
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
