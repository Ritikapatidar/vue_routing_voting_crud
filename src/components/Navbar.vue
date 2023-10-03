<template>
    <div class="container m-auto">
        <div class="row">
            <nav class="navbar navbar-expand navbar-dark bg-dark">
                <ul class="navbar-nav">
                    <li class="nav-item ms-2 me-3">
                        <router-link to="/Home" class="nav-link text-light rounded">Home</router-link>
                    </li>
                    <li class="nav-item ms-2 me-3">
                        <router-link to="/userData" class="nav-link text-light rounded">User Data</router-link>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>
<style>
.router-link-exact-active {
    background-color: rgb(34, 129, 151);
}
</style>