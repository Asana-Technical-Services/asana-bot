import Status from 'http-status-codes';
import endpoints from "./endpoints"
import axios from "axios"

const due = {
    today: "#today",
    tomorrow: "#tomorrow",
    nextWeek: "#week",
    nextMonth: "#month"
}

const parser = async (input) => {
    let shouldUpdate = false
    let text = input

    // Init dates
    const today = new Date()
    const dueDate = new Date(today)

    if (text.includes(due.today)) {
        text = text.replace(due.today, "")
        shouldUpdate = true
    } else if (text.includes(due.tomorrow)) {
        dueDate.setDate(dueDate.getDate() + 1)
        text = text.replace(due.tomorrow, "")
        shouldUpdate = true
    } else if (text.includes(due.nextWeek)) {
        dueDate.setDate(dueDate.getDate() + 7)
        text = text.replace(due.nextWeek, "")
        shouldUpdate = true
    } else if (text.includes(due.nextMonth)) {
        dueDate.setMonth(dueDate.getMonth() + 1)
        text = text.replace(due.nextMonth, "")
        shouldUpdate = true
    } else {
        let regex = /#(.*)days/
        let days = text.match(regex)
        if (days) {
            dueDate.setDate(dueDate.getDate() + parseInt(days[1], 10))
            text = text.replace(regex, "")
            shouldUpdate = true
        }

        regex = /#(.*)months/
        let months = text.match(regex)
        if (months) {
            dueDate.setMonth(dueDate.getMonth() + parseInt(months[1], 10))
            text = text.replace(regex, "")
            shouldUpdate = true
        }
    }

    return ({
        update: shouldUpdate, 
        dueDate: dueDate, 
        text: text.trim()
    })
}

export default parser


// const parser = async (task) => {
//     try {
//         let shouldUpdate = false
//         let name = task.name

//         let update = {
//             data: {}
//         }

//         // Init dates
//         const today = new Date()
//         const dueDate = new Date(today)

//         if (task.name.includes(due.today)) {
//             // dueDate = today
//             name = name.replace(due.today, "")
//             shouldUpdate = true
//         } else if (task.name.includes(due.tomorrow)) {
//             dueDate.setDate(dueDate.getDate() + 1)
//             name = name.replace(due.tomorrow, "")
//             shouldUpdate = true
//         } else if (task.name.includes(due.nextWeek)) {
//             dueDate.setDate(dueDate.getDate() + 7)
//             name = name.replace(due.nextWeek, "")
//             shouldUpdate = true
//         } else if (task.name.includes(due.nextMonth)) {
//             dueDate.setMonth(dueDate.getMonth() + 1)
//             name = name.replace(due.nextMonth, "")
//             shouldUpdate = true
//         } else {
//             let regex = /#(.*)days/
//             let days = name.match(regex)
//             if (days) {
//                 dueDate.setDate(dueDate.getDate() + parseInt(days[1], 10))
//                 name = name.replace(regex, "")
//                 shouldUpdate = true
//             }

//             regex = /#(.*)months/
//             let months = name.match(regex)
//             if (months) {
//                 dueDate.setMonth(dueDate.getMonth() + parseInt(months[1], 10))
//                 name = name.replace(regex, "")
//                 shouldUpdate = true
//             }
//         }

//         if (shouldUpdate) {
//             update.data.due_on = dueDate.toISOString().slice(0, 10) // format YYYY-MM-DD
//             update.data.name = name.trim()

//             await axios.put(endpoints.tasks + task.gid, update, {
//                 headers: {
//                     'Authorization': process.env.ASANA_TOKEN
//                 }
//             }).then(res => {
//                 console.log('Task %d properties updated', task.gid)
//             }).catch(error => {
//                 console.log('Task %d properties failed', task.gid)
//                 console.log(error)
//             })
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }