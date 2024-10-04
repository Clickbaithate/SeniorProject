import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
  faFolderPlus,
  faEyeSlash,
  faEye,
  faEnvelope,
  faE,
} from "@fortawesome/free-solid-svg-icons";
import HorizontalList from "../components/HorizontalList";
import { useNavigate } from "react-router-dom";

const MoviePage = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState("light");
  const [temp, setTemp] = useState("text-black");
  const [user, setUser] = useState(null);
  const [isToggled, setIsToggled] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.warn(sessionError);
        return;
      }

      if (session) {
        const { data, error } = await supabase
          .from("Users")
          .select()
          .eq("user_id", session.user.id)
          .single();

        if (error) {
          console.warn("Error fetching profile:", error);
        } else if (data) {
          setUser(data);
          const userTheme = data.theme_settings;
          setIsToggled(userTheme);
          setTheme(userTheme ? "dark" : "light");
        }
      }
    };

    fetchProfile();
  }, []);

  // Was having trouble using temp, used this. will fix later
  useEffect(() => {
    setTemp(theme === "light" ? "text-black" : "text-white");
  }, [theme]);

  // Movies data
  const trendingMovies = [
    {
      title: "Avengers: Infinity War",
      poster:
        "https://m.media-amazon.com/images/I/71eHZFw+GlL._AC_UF894,1000_QL80_.jpg",
      id: 1,
      releaseDate: "2018-04-27",
      genres: ["Action", "Adventure", "Sci-Fi"],
      runtime: 149,
      tagline: "An entire universe. Once and for all.",
      overview:
        "The Avengers must stop Thanos, an intergalactic warlord, from getting his hands on all the infinity stones.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Moonlight",
      poster:
        "https://posterhouse.org/wp-content/uploads/2021/05/moonlight_0.jpg",
      id: 2,
      releaseDate: "2016-10-21",
      genres: ["Drama"],
      runtime: 111,
      tagline: "This is the story of a lifetime.",
      overview:
        "A young African-American man grapples with his identity and sexuality while experiencing the everyday struggles of childhood, adolescence, and burgeoning adulthood.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Encanto",
      poster:
        "https://lumiere-a.akamaihd.net/v1/images/p_encanto_homeent_22359_4892ae1c.jpeg",
      id: 3,
      releaseDate: "2021-11-24",
      genres: ["Animation", "Family", "Fantasy"],
      runtime: 102,
      tagline: "There's a little magic in all of us... almost all of us.",
      overview:
        "A young Colombian girl has to face the frustration of being the only member of her family without magical powers.",
      banner: "",
      inPlaylist: true,
      hasWatched: false,
    },
    {
      title: "Inside Out 2",
      poster:
        "https://cdn.moviefone.com/admin-uploads/posters/insideout2-movie-poster_1709834077.jpg?d=360x540&q=80",
      id: 4,
      releaseDate: "2024-06-14",
      genres: ["Animation", "Comedy", "Adventure"],
      runtime: 105,
      tagline: "Emotions are back in action.",
      overview:
        "Riley, now a teenager, must navigate new challenges and emotions as she enters high school.",
      banner: "",
      inPlaylist: false,
      hasWatched: false,
    },
    {
      title: "Love Again",
      poster:
        "https://m.media-amazon.com/images/M/MV5BODIxY2NkYWEtNWE3ZS00NDZhLWFlMDktMTE0NDNlZDk0MzAyXkEyXkFqcGc@._V1_.jpg",
      id: 5,
      releaseDate: "2023-05-05",
      genres: ["Romance", "Comedy", "Drama"],
      runtime: 104,
      tagline: "Love can happen again.",
      overview:
        "A grieving woman gives love another chance after receiving romantic texts meant for someone else.",
      banner: "",
      inPlaylist: true,
      hasWatched: true,
    },
    {
      title: "Scary Movie",
      poster:
        "https://m.media-amazon.com/images/M/MV5BZGRmMGRhOWMtOTk3Ni00OTRjLTkyYTAtYzA1M2IzMGE3NGRkXkEyXkFqcGc@._V1_.jpg",
      id: 6,
      releaseDate: "2000-07-07",
      genres: ["Comedy", "Horror"],
      runtime: 88,
      tagline: "No mercy. No shame. No sequel.",
      overview:
        "A group of teens find themselves getting killed off by a mysterious killer in this parody of slasher films.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Beetlejuice Beetlejuice",
      poster:
        "https://all.web.img.acsta.net/img/88/01/8801185034fbb3e22b654c923f649201.jpg/r_2500_x",
      id: 7,
      releaseDate: "1988-03-30",
      genres: ["Comedy", "Fantasy"],
      runtime: 92,
      tagline: "He's guaranteed to put some life in your afterlife.",
      overview:
        "A recently deceased couple hire a bizarre poltergeist to drive out the living who have moved into their home.",
      banner: "",
      inPlaylist: true,
      hasWatched: false,
    },
    {
      title: "Elemental",
      poster:
        "https://lumiere-a.akamaihd.net/v1/images/p_disneyplusoriginals_elemental_poster_rebrand_a0788af2.jpeg",
      id: 8,
      releaseDate: "2023-06-16",
      genres: ["Animation", "Family", "Fantasy"],
      runtime: 109,
      tagline: "Opposites react.",
      overview:
        "In a city where fire, water, land, and air residents live together, a fiery young woman and a go-with-the-flow guy discover something elemental: how much they have in common.",
      banner: "",
      inPlaylist: true,
      hasWatched: false,
    },
    {
      title: "The Garfield Movie",
      poster:
        "https://all.web.img.acsta.net/img/91/41/91412fbc0ed5d0bf8962e9d9523da195.jpg",
      id: 9,
      releaseDate: "2024-05-24",
      genres: ["Animation", "Comedy"],
      runtime: 90,
      tagline: "Life’s short. Nap hard.",
      overview:
        "Garfield embarks on a new misadventure where he continues to lounge, eat, and meddle in the lives of his human friends.",
      banner: "",
      inPlaylist: false,
      hasWatched: false,
    },
    {
      title: "Wish",
      poster:
        "https://upload.wikimedia.org/wikipedia/en/d/de/WishMoviePoster.jpg",
      id: 10,
      releaseDate: "2024-11-22",
      genres: ["Animation", "Musical", "Family"],
      runtime: 100,
      tagline: "When you wish upon a star...",
      overview:
        "A young girl's wish leads to an unexpected journey filled with magic and adventure.",
      banner: "",
      inPlaylist: false,
      hasWatched: false,
    },
    {
      title: "Us",
      poster:
        "https://www.indiewire.com/wp-content/uploads/2019/12/us-1.jpg?w=758",
      id: 11,
      releaseDate: "2019-03-22",
      genres: ["Horror", "Thriller"],
      runtime: 116,
      tagline: "Watch yourself.",
      overview:
        "A family’s serene beach vacation turns to chaos when their doppelgängers appear and begin to terrorize them.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Deadpool & Wolverine",
      poster:
        "https://cdn.marvel.com/content/1x/deadpoolandwolverine_lob_crd_03.jpg",
      id: 12,
      releaseDate: "2024-07-26",
      genres: ["Action", "Comedy"],
      runtime: 130,
      tagline: "The most unexpected team-up.",
      overview:
        "Deadpool and Wolverine join forces for a new adventure that brings out the worst (and best) in both.",
      banner: "",
      inPlaylist: true,
      hasWatched: false,
    },
    {
      title: "Avatar: The Way of Water",
      poster:
        "https://images.squarespace-cdn.com/content/v1/5a7f41ad8fd4d236a4ad76d0/1669842753281-3T90U1EY5HUNCG43XERJ/A2_Poster_DC_v80_PAYOFF_221029_12trimHD.jpg",
      id: 13,
      releaseDate: "2022-12-16",
      genres: ["Action", "Adventure", "Sci-Fi"],
      runtime: 192,
      tagline: "Return to Pandora.",
      overview:
        "Jake Sully and Neytiri must protect their family from new threats on the lush alien moon of Pandora.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Pixels",
      poster:
        "https://m.media-amazon.com/images/M/MV5BMzIyNTc1NmUtOTBlNS00YzEwLTlkZTMtZjJkMGM2YzNkYmY3XkEyXkFqcGc@._V1_.jpg",
      id: 14,
      releaseDate: "2015-07-24",
      genres: ["Action", "Comedy", "Sci-Fi"],
      runtime: 106,
      tagline: "Game on.",
      overview:
        "When aliens misinterpret video feeds of classic arcade games as a declaration of war, they attack Earth in the form of the video games.",
      banner: "",
      inPlaylist: false,
      hasWatched: false,
    },
    {
      title: "A Quiet Place: Day One",
      poster:
        "https://wwwimage-us.pplusstatic.com/thumbnails/photos/w370-q80/movie_asset/54/87/88/movie_asset_a9b1404e-51eb-4e95-8665-5c2d83a59b6c.jpg",
      id: 15,
      releaseDate: "2024-03-08",
      genres: ["Horror", "Thriller"],
      runtime: 96,
      tagline: "The silence is still deadly.",
      overview:
        "A prequel to the first two 'Quiet Place' films that details the chaos and survival of the first day of the invasion.",
      banner: "",
      inPlaylist: false,
      hasWatched: false,
    },
    {
      title: "Avengers",
      poster:
        "https://www.anythinklibraries.org/sites/default/files/styles/full/public/the_avengers.jpg?itok=pyYFzE_z",
      id: 16,
      releaseDate: "2012-05-04",
      genres: ["Action", "Adventure", "Sci-Fi"],
      runtime: 143,
      tagline: "Some assembly required.",
      overview:
        "Earth's mightiest heroes must come together to stop Loki and his alien army from enslaving humanity.",
      banner: "",
      inPlaylist: true,
      hasWatched: true,
    },
    {
      title: "Avengers: Infinity War",
      poster: "https://i.ebayimg.com/images/g/vmoAAOSwM~1gol-e/s-l400.jpg",
      id: 17,
      releaseDate: "2018-04-27",
      genres: ["Action", "Adventure", "Sci-Fi"],
      runtime: 149,
      tagline: "An entire universe. Once and for all.",
      overview:
        "The Avengers must stop Thanos from collecting all the Infinity Stones and wiping out half of all life.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Doctor Strange: Multiverse of Madness",
      poster:
        "https://static.wixstatic.com/media/c0ca52_861cbfbd84344362a233f609406354cd~mv2.jpg/v1/fill/w_540,h_675,al_c,q_85,enc_auto/c0ca52_861cbfbd84344362a233f609406354cd~mv2.jpg",
      id: 18,
      releaseDate: "2022-05-06",
      genres: ["Action", "Adventure", "Fantasy"],
      runtime: 126,
      tagline: "Enter a new dimension of Strange.",
      overview:
        "Doctor Strange must navigate the multiverse with the help of mystical allies and face a new foe.",
      banner: "",
      inPlaylist: false,
      hasWatched: false,
    },
    {
      title: "Ant-Man and the Wasp",
      poster:
        "https://cdn.posteritati.com/posters/000/000/056/046/antman-and-the-wasp-sm-web.jpg",
      id: 19,
      releaseDate: "2018-07-06",
      genres: ["Action", "Adventure", "Comedy"],
      runtime: 118,
      tagline: "Real heroes. Not actual size.",
      overview:
        "Scott Lang teams up with Hope van Dyne as they embark on a mission to uncover secrets from their past.",
      banner: "",
      inPlaylist: true,
      hasWatched: true,
    },
    {
      title: "Thor: Ragnarok",
      poster:
        "https://townsquare.media/site/442/files/2017/10/thor_ragnarok_ver2_xlg1.jpg?w=780&q=75",
      id: 20,
      releaseDate: "2017-11-03",
      genres: ["Action", "Adventure", "Comedy"],
      runtime: 130,
      tagline: "No hammer. No problem.",
      overview:
        "Thor must escape the alien planet of Sakaar in time to save Asgard from Hela's wrath.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Black Panther",
      poster:
        "https://blog.printkeg.com/wp-content/uploads/2019/03/black-panther-poster.jpg",
      id: 21,
      releaseDate: "2018-02-16",
      genres: ["Action", "Adventure", "Sci-Fi"],
      runtime: 134,
      tagline: "Long live the king.",
      overview:
        "T'Challa, the king of Wakanda, rises to the throne but must defend his nation from a dangerous adversary.",
      banner: "",
      inPlaylist: true,
      hasWatched: true,
    },
    {
      title: "Ms. Marvel",
      poster:
        "https://i.etsystatic.com/18242346/r/il/bd83d7/4015944809/il_570xN.4015944809_q17a.jpg",
      id: 22,
      releaseDate: "2023-07-28",
      genres: ["Action", "Adventure", "Fantasy"],
      runtime: 112,
      tagline: "A hero unlike any other.",
      overview:
        "Kamala Khan, a teenage superhero fan, gets unexpected superpowers and must find her place in the superhero world.",
      banner: "",
      inPlaylist: false,
      hasWatched: false,
    },
    {
      title: "Ant-Man",
      poster:
        "https://i.redd.it/what-have-been-some-of-your-favorite-marvel-movie-posters-v0-hefukfv1updd1.jpg?width=760&format=pjpg&auto=webp&s=7c39e90fa47cd9081f22823cbbac22a9e1a47214",
      id: 23,
      releaseDate: "2015-07-17",
      genres: ["Action", "Adventure", "Comedy"],
      runtime: 117,
      tagline: "Heroes come in all sizes.",
      overview:
        "A con man is recruited by Hank Pym to use a suit that gives him the ability to shrink in size to become a superhero.",
      banner: "",
      inPlaylist: true,
      hasWatched: true,
    },
    {
      title: "Iron Man",
      poster:
        "https://lh5.googleusercontent.com/proxy/whJNlo-w4QVV9DV1LJklWYJ39FyYnEj547rB25XNrlzkJ4cnWuZgF4O3PqsWdQ5gfyD6Ja4g1eJn7JMYdppJNsmWbN1iboT3mApVFkz7",
      id: 24,
      releaseDate: "2008-05-02",
      genres: ["Action", "Sci-Fi", "Adventure"],
      runtime: 126,
      tagline: "Heroes aren't born. They're built.",
      overview:
        "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a weaponized suit of armor to fight evil.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Thunderbolts",
      poster: "https://cdn.marvel.com/content/1x/thunderbolts_lob_crd_03.jpg",
      id: 25,
      releaseDate: "2024-12-20",
      genres: ["Action", "Adventure", "Thriller"],
      runtime: 140,
      tagline: "Chaos at every turn.",
      overview:
        "A group of antiheroes is tasked with dangerous missions that no one else can handle.",
      banner: "",
      inPlaylist: false,
      hasWatched: false,
    },
    {
      title: "Spider-Man: Far From Home",
      poster:
        "https://i.etsystatic.com/18242346/r/il/eb594f/1929825990/il_570xN.1929825990_8vdi.jpg",
      id: 26,
      releaseDate: "2019-07-02",
      genres: ["Action", "Adventure", "Comedy"],
      runtime: 129,
      tagline: "No way home.",
      overview:
        "Peter Parker's European vacation is interrupted when Nick Fury recruits him to uncover the mystery behind a series of elemental creature attacks.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Black Widow",
      poster:
        "https://images.sellbrite.com/production/152272/P6640-FRALU026/a945c39f-9685-546f-a4ec-dafbaa1171c3.jpg",
      id: 27,
      releaseDate: "2021-07-09",
      genres: ["Action", "Adventure", "Thriller"],
      runtime: 134,
      tagline: "Her world. Her secrets.",
      overview:
        "Natasha Romanoff confronts the darker parts of her ledger when a dangerous conspiracy with ties to her past arises.",
      banner: "",
      inPlaylist: true,
      hasWatched: true,
    },
    {
      title: "The Incredible Hulk",
      poster:
        "https://lh6.googleusercontent.com/proxy/WD58c-Gy7j-0Pkc1GGcwo8KN3jLZjpGj1AzZOoCq9EDTToDXxPh57b7eN5dnCweL1rwFvaseMTvuS9ZgUb0ApWwSsaVKV-XtEL5kGcNJlWM",
      id: 28,
      releaseDate: "2008-06-13",
      genres: ["Action", "Adventure", "Sci-Fi"],
      runtime: 112,
      tagline: "On the run, out of control.",
      overview:
        "Bruce Banner becomes the Hulk and must evade the military as he searches for a cure to his condition.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Captain America: Civil War",
      poster:
        "https://i0.wp.com/thinkmonsters.com/speakinghuman/media/wp-content/uploads/MOVIE_CaptainAmerica_CivilWar.jpg?resize=540%2C810&ssl=1",
      id: 29,
      releaseDate: "2016-05-06",
      genres: ["Action", "Adventure", "Sci-Fi"],
      runtime: 147,
      tagline: "Divided we fall.",
      overview:
        "Political pressure mounts to install a system of accountability for the Avengers, leading to a clash between Captain America and Iron Man.",
      banner: "",
      inPlaylist: true,
      hasWatched: true,
    },
    {
      title: "Thor: Love and Thunder",
      poster:
        "https://static0.srcdn.com/wordpress/wp-content/uploads/2023/03/thor-love-and-thunder-poster.jpeg",
      id: 30,
      releaseDate: "2022-07-08",
      genres: ["Action", "Adventure", "Comedy"],
      runtime: 119,
      tagline: "Love will bring the thunder.",
      overview:
        "Thor embarks on a journey to find inner peace but must return to action when Gorr the God Butcher threatens to eliminate the gods.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "The Batman",
      poster: "https://m.media-amazon.com/images/I/81Bivc7COzL.jpg",
      id: 31,
      releaseDate: "2022-03-04",
      genres: ["Action", "Crime", "Drama"],
      runtime: 176,
      tagline: "Unmask the truth.",
      overview:
        "Batman ventures into Gotham City's underworld when a sadistic killer leaves behind a trail of cryptic clues.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Batman v Superman",
      poster: "https://m.media-amazon.com/images/I/41YfbMnKAOL._AC_.jpg",
      id: 32,
      releaseDate: "2016-03-25",
      genres: ["Action", "Adventure", "Sci-Fi"],
      runtime: 151,
      tagline: "Justice or revenge?",
      overview:
        "Batman and Superman clash over ideological differences while a new threat emerges to endanger humanity.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "The Dark Knight",
      poster: "https://m.media-amazon.com/images/I/51pzUy6sy9L._AC_.jpg",
      id: 33,
      releaseDate: "2008-07-18",
      genres: ["Action", "Crime", "Drama"],
      runtime: 152,
      tagline: "Welcome to a world without rules.",
      overview:
        "Batman faces his toughest challenge when a dangerous new criminal mastermind known as The Joker emerges from the shadows.",
      banner: "",
      inPlaylist: true,
      hasWatched: true,
    },
    {
      title: "The Flash",
      poster: "https://m.media-amazon.com/images/I/81A+ZsNLBcL.jpg",
      id: 34,
      releaseDate: "2023-06-16",
      genres: ["Action", "Adventure", "Fantasy"],
      runtime: 144,
      tagline: "Worlds collide.",
      overview:
        "Barry Allen uses his super speed to change the past, but his attempt to save his family creates a world without superheroes, forcing him to race for his life.",
      banner: "",
      inPlaylist: false,
      hasWatched: false,
    },
    {
      title: "The Amazing Spider-Man",
      poster:
        "https://www.indiewire.com/wp-content/uploads/2017/05/the-amazing-spider-man-2012.jpg?w=674",
      id: 35,
      releaseDate: "2012-07-03",
      genres: ["Action", "Adventure", "Sci-Fi"],
      runtime: 136,
      tagline: "The untold story begins.",
      overview:
        "After being bitten by a genetically-altered spider, Peter Parker uses his new abilities to face the mysterious figure behind his parents' disappearance.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Man of Steel",
      poster:
        "https://townsquare.media/site/442/files/2022/10/attachment-man_of_steel_ver2_xlg.jpg?w=780&q=75",
      id: 36,
      releaseDate: "2013-06-14",
      genres: ["Action", "Adventure", "Sci-Fi"],
      runtime: 143,
      tagline: "You will believe that a man can fly.",
      overview:
        "Clark Kent, one of the last of an extinguished race, is forced to reveal his true identity when Earth is invaded by an army of survivors who threaten to bring the planet to the brink of destruction.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Superman Returns",
      poster:
        "https://townsquare.media/site/442/files/2022/10/attachment-superman_returns_ver2_xlg.jpg?w=780&q=75",
      id: 37,
      releaseDate: "2006-06-28",
      genres: ["Action", "Adventure", "Sci-Fi"],
      runtime: 154,
      tagline: "He’s back.",
      overview:
        "Superman returns to Earth after spending five years in space to find that Lois Lane has moved on with her life, and the world no longer needs a savior.",
      banner: "",
      inPlaylist: true,
      hasWatched: false,
    },
    {
      title: "Suicide Squad",
      poster:
        "https://m.media-amazon.com/images/M/MV5BMjM1OTMxNzUyM15BMl5BanBnXkFtZTgwNjYzMTIzOTE@._V1_.jpg",
      id: 38,
      releaseDate: "2016-08-05",
      genres: ["Action", "Adventure", "Fantasy"],
      runtime: 123,
      tagline: "Worst. Heroes. Ever.",
      overview:
        "A secret government agency recruits some of the most dangerous incarcerated criminals to form a defensive task force. Their first mission: save the world from the apocalypse.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Justice League",
      poster:
        "https://stampede.clearfield.org/wp-content/uploads/2017/11/Justice-League-Poster-Comic-Book-Movie.jpg",
      id: 39,
      releaseDate: "2017-11-17",
      genres: ["Action", "Adventure", "Sci-Fi"],
      runtime: 120,
      tagline: "You can't save the world alone.",
      overview:
        "Batman and Wonder Woman assemble a team of heroes to combat a powerful new enemy.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Supergirl",
      poster:
        "https://townsquare.media/site/442/files/2022/10/attachment-supergirl_xlg.jpg?w=780&q=75",
      id: 40,
      releaseDate: "1984-07-19",
      genres: ["Action", "Adventure", "Fantasy"],
      runtime: 125,
      tagline: "Her first great adventure.",
      overview:
        "After losing a powerful orb, Kara Zor-El, Superman's cousin, comes to Earth to retrieve it and is forced to confront a power-hungry villain.",
      banner: "",
      inPlaylist: false,
      hasWatched: false,
    },
    {
      title: "Finding Nemo",
      poster: "https://www.filmposters.com/images/posters/21847.jpg",
      id: 41,
      releaseDate: "2003-05-30",
      genres: ["Animation", "Adventure", "Comedy"],
      runtime: 100,
      tagline:
        "There are 3.7 trillion fish in the ocean. They’re looking for one.",
      overview:
        "After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.",
      banner: "",
      inPlaylist: true,
      hasWatched: true,
    },
    {
      title: "The Princess and The Frog",
      poster:
        "https://cdn.abcotvs.com/dip/images/413466_112614-cc-disney-posters-princessfrog-img.jpg",
      id: 42,
      releaseDate: "2009-12-11",
      genres: ["Animation", "Adventure", "Comedy"],
      runtime: 97,
      tagline: "Every love story begins with a kiss.",
      overview:
        "A waitress, desperate to fulfill her dreams as a restaurant owner, is set on a journey to turn a frog prince back into a human being.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "The Lion King",
      poster:
        "https://i.etsystatic.com/15472631/r/il/3a35e8/3774140902/il_570xN.3774140902_3nma.jpg",
      id: 43,
      releaseDate: "1994-06-15",
      genres: ["Animation", "Adventure", "Drama"],
      runtime: 88,
      tagline:
        "The greatest adventure of all is finding our place in the circle of life.",
      overview:
        "A young lion prince flees his kingdom after the murder of his father, only to learn the true meaning of responsibility and bravery.",
      banner: "",
      inPlaylist: true,
      hasWatched: true,
    },
    {
      title: "The Incredibles",
      poster:
        "https://preview.redd.it/what-is-the-most-badass-animated-movie-poster-youve-ever-v0-bz8ouezwx9kd1.jpeg?width=1800&format=pjpg&auto=webp&s=9e2e90fb46b07e09cbd266d641f1e02f95b78fe2",
      id: 44,
      releaseDate: "2004-11-05",
      genres: ["Animation", "Action", "Adventure"],
      runtime: 115,
      tagline: "No gut, no glory.",
      overview:
        "A family of undercover superheroes, while trying to live the quiet suburban life, are forced into action to save the world.",
      banner: "",
      inPlaylist: false,
      hasWatched: true,
    },
    {
      title: "Aladdin",
      poster: "https://www.filmposters.com/images/posters/19085.jpg",
      id: 45,
      releaseDate: "1992-11-25",
      genres: ["Animation", "Adventure", "Family"],
      runtime: 90,
      tagline: "Wish granted.",
      overview:
        "A kind-hearted street urchin and a power-hungry Grand Vizier vie for a magic lamp that has the power to make their deepest wishes come true.",
      banner: "",
      inPlaylist: true,
      hasWatched: true,
    },
  ];

  // Find the selected movie based on the ID from URL params
  const currentMovie = trendingMovies.find(
    (movie) => movie.id === parseInt(id)
  );

  const handleClose = () => {
    navigate(-1);
    console.log("Closed");
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Dark #2D2E39
  // Dark Contrast #25262F

  // Light #FFFFFF
  // Light Contrast #E4E4E4

  return (
    <>
      <div className={`relative h-[800px] flex flex-col ${ theme === "light" ? "bg-[#FFFFFF]" : "bg-[#2D2E39]" }`} >
        {/* Top Half */}
        <div className="relative flex flex-1 justify-end items-start rounded-br-3xl rounded-bl-3xl">
          {/* Background Image */}
          <div className="bg-[url('https://image.tmdb.org/t/p/original/1wP1phHo2CROOqzv7Azs0MT5esU.jpg')] bg-contain opacity-25 w-full h-full rounded-br-3xl rounded-bl-3xl"></div>

          {/* Exit Button */}
          <button onClick={() => handleClose()} className="absolute top-8 right-12 z-20" >
            {" "}
            {/* Increased z-index */}
            <FontAwesomeIcon className={`w-12 h-12 transition-all ease-in-out duration-500 transform hover:scale-125 ${ theme === "light" ? "text-[#25262F]" : "text-[#E4E4E4]" } `} icon={faCircleXmark} />
          </button>
        </div>

        {/* Bottom Half */}
        <div className={`flex flex-col flex-1 overflow-hidden ${ theme === "light" ? "bg-[#FFFFFF]" : "bg-[#2D2E39]" }`} >
          <div className="flex-1 flex items-center overflow-y-auto">
            {/* Content Section */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center">
              <img src={currentMovie.poster} className="shadow-[rgba(0,0,15,0.5)_10px_15px_4px_0px] min-h-[540px] max-h-[540px] max-w-[380px] rounded-2xl ml-20" />
              <div className="flex flex-col ml-10 mt-72 font-body">
                {/* Row for title and buttons */}
                <div className="flex items-center space-x-12">
                  <div className={`${temp} text-5xl w-[600px]}`}>
                    {currentMovie.title}
                  </div>
                  <button onClick={() => handleClose()} className={`transition-all ease-in-out duration-500 transform hover:scale-110 px-3 py-3 flex rounded-full ${ theme === "light" ? "bg-[#E4E4E4]" : "bg-[#25262F]" } shadow-[rgba(0,0,0,0.5)_5px_10px_4px_0px]`} >
                    <FontAwesomeIcon className={`w-6 h-6 ${temp}`} icon={faFolderPlus} />
                  </button>
                  <button onClick={() => handleClose()} className={`transition-all ease-in-out duration-500 transform hover:scale-110 px-3 py-3 flex rounded-full ${ theme === "light" ? "bg-[#E4E4E4]" : "bg-[#25262F]" } shadow-[rgba(0,0,0,0.5)_5px_10px_4px_0px]`} >
                    <FontAwesomeIcon className={`w-6 h-6 ${temp}`} icon={faEye} />
                  </button>
                  <button onClick={() => handleClose()} className={`transition-all ease-in-out duration-500 transform hover:scale-110 px-3 py-3 flex rounded-full ${ theme === "light" ? "bg-[#E4E4E4]" : "bg-[#25262F]" } shadow-[rgba(0,0,0,0.5)_5px_10px_4px_0px]`} >
                    <FontAwesomeIcon className={`w-6 h-6 ${temp}`} icon={faEnvelope} />
                  </button>
                </div>
                <div className="flex items-center space-x-4 mt-8">
                  <div className={`${temp}`}>{currentMovie.releaseDate}</div>
                  <div className={`${temp}`}>*</div>
                  <div className={`${temp}`}>
                    {currentMovie.genres[0]} {currentMovie.genres[1]}{" "}
                    {currentMovie.genres[2]}
                  </div>
                  <div className={`${temp}`}>*</div>
                  <div className={`${temp}`}>
                    {currentMovie.runtime} Minutes
                  </div>
                </div>
                <div className={`text-gray-400 py-2`}>
                  {currentMovie.tagline}
                </div>
                <div className={`${temp} text-2xl`}>Overview</div>
                <div className={`${temp} py-2`}>{currentMovie.overview}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      <div
        className={`${ theme === "light" ? "bg-[#FFFFFF]" : "bg-[#2D2E39]" } relative z-10 mt-[-100px] pl-3.5`} >
        <h1 className={`${temp} text-4xl font-body ml-16`}>Similar Movies</h1>
        <HorizontalList className="" movies={trendingMovies} theme={theme} />
      </div>
    </>
  );
};

export default MoviePage;
