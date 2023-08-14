drop table if exists users cascade;

drop table if exists pokemons cascade;

drop table if exists moninv cascade;

drop table if exists monstats cascade;

create table users(
    id varchar(36) unique,
    nickname varchar(100) unique,
    email varchar(100) primary key,
    password varchar(1000) not null,
    isAdmin boolean default '0'
);

create table pokemons(
    entry int primary key,
    name varchar(50) unique not null,
    type varchar(50) not null,
    ability varchar(50) not null,
    icon varchar(1000) not null
);

create table moninv(
    id varchar(36) primary key not null,
    user_id varchar(36) not null,
    pok_entry int not null,
    foreign key (user_id) references users(id),
    foreign key (pok_entry) references pokemons(entry)
);

create table monstats(
    name varchar(50) not null,
    HP int not null,
    Attack int not null,
    Defence int not null,
    Sp.Attack int not null,
    Sp.Defence int not null,
    Speed int not null,
);