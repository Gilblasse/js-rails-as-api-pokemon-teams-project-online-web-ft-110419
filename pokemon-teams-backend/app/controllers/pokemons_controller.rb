class PokemonsController < ApplicationController

    def index
        pokemons = Pokemon.all
        render json: PokemonSerializer.new(pokemons)
    end

    def create
        trainer = Trainer.find_by(id: params[:trainer_id])
        trainer.pokemons.create(nickname: Faker::Name.first_name, species: Faker::Games::Pokemon.name)
        render json: trainer.pokemons.last
    end

    def show
        pokemon = Pokemon.find_by(id: params[:id])
        render json: PokemonSerializer.new(pokemon)    
    end

    def destroy
        # binding.pry
        pokemon = Pokemon.find_by(id: params[:id])
        pokemon.destroy
    end

end
