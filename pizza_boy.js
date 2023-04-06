// Give Alan some knowledge about the world
// corpus(`
//     Hello, I'm Pizza Boy.
//     We are open 24/7.
//     we offer pizza and drinks.
//     in the pizza we offer four flavor chiken , fajita , cheese and spicy .
//     in the drinks we offer 3 drink Soda, Black Water , Lemon Water.
//     I will help user to make order to help user , user may say order , what do you have in menu ? .
//     I'm Pizza Boy. I'm a virtual assistant. I'm here to help you your pizza.
// `);

// Use this sample to create your own voice commands
intent('(hello| hi)', p => {
    p.play('(Hello|Hi ), To start the conversation say order or help ?');
});

const drinkContext = context(() => {
    follow("$(DRINK Soda|Black Water|Lemon Water)", p => {
        if(p.state){ // for now let go with p.state
            p.play(`here is your ${p.state.qty} ${p.state.size} ${p.state.flavor} pizza and ${p.DRINK.value}`)
            p.resolve()
        }else{
            p.play(`here is your ${p.DRINK.value}`)
            p.resolve()
        }
    })
})

const drinkFollowUp = context(() => {
    intent("yes" , p => {
        p.play('We have Soda, Black Water , Lemon Water which one would you like go with ? ')
        p.then(drinkContext , {state:{...p.state}})
    })
    intent("no" , p => {
        p.play(`Ok ,Here is your ${p.state.qty} ${p.state.size} ${p.state.flavor} pizza`)
        p.resolve()
    })
})

const qtyContext = context(()=> {
    follow("$(QTY NUMBER)" , p => {
        p.play("Would you like to have drink with it ?")
        p.then(drinkFollowUp, {state:{qty:p.QTY.value, ...p.state}})
    })    
})

//     fallback("sorry i did not get it , can you please tell me which size you want to go with ? or to restart the conversation please say restart")


const sizeContext = context(()=>{
    follow("$(SIZE small|medium|large)", p =>{
        p.play(`Ok ${p.SIZE.value} ${p.state.flavor} pizza , Can you please tell me ,How many pizza would you like to have`)
        p.then(qtyContext, {state:{size:p.SIZE.value,...p.state}})
    })
})

//     fallback("sorry i did not get it , can you please tell me which size you want to go with ? or to restart the conversation please say restart")


const falvorContext = context(() =>{    
    follow("$(FLAVOR fajita|chicken|spicy|cheese)", p => {
        p.play(`we have 3 sizes , small , medium , large. Which one you would like to choose ?`)
        p.then(sizeContext,{state:{flavor:p.FLAVOR.value}})
    })    
})

//     fallback("sorry i did not get it , Please tell me the flavor we have fajita , chicken , spicy , cheese or to restart the conversation please say restart")


const chooseMenu = context(() => {    
    intent('(i want to order|get me) $(MENU pizza|drink)',p => {
    const menu = p.MENU.value.toLowerCase()
    switch(menu){
        case("pizza"):
            p.play('We have 4 flavor of pizza fajita , chicken , spicy , cheese which one would you like go with ? ')
            p.then(falvorContext )
            break;
        case("drink"):
            p.play('We have Soda, Black Water, Lemon Water which one would you like go with ? ')
            p.then(drinkContext )
        }
    })
})

const userIntentPattern = [
    "(what do you have|tell me|i want to order|) (menu|order) (something|)",
    "(i am|) (feeling|) hungry ",
    "i want eat something",
]

intent(userIntentPattern, p =>{
    p.play("we have pizza and drink what do you want to order ?")
    p.then(chooseMenu)
})

intent('Cancel (the order|)', p => {
        p.play('Your order is cancelled to restart the conversation say order or menu');
        p.resolve();
});

question(
    'How does this work',
    'How to use this',
    'help',
    'What can I do here',
    'What (should I|can I|to) say',
    'What commands are available',
    reply('Just say: (what do you have in menu|i want to order|order).'),
);