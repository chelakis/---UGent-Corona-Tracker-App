const peos = new Vue({
    data: {
        friends: ["Jack", "John"],
    },
    template:`
    <div>
        <li v-for="friend in friends">{{friend}}</li>
    </div>
    `,
});