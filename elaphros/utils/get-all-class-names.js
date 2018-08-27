const all = document.getElementsByTagName('*')
const uClasses = new Set()

for (let i = 0, max = all.length; i < max; i++) {
  all[i].classList.forEach((c) => { uClasses.add(c) })
}

const a = []

uClasses.forEach((c) => {
  a.push(c)
})

console.log(a)
