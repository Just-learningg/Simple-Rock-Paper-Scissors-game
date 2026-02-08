 const game = {
                playerMove : "None",
                ComputerMove : "None"
            };

           const score = JSON.parse(localStorage.getItem("score")) || {
                        Wins: 0,
                        Loses: 0,
                        Draws: 0
                        };




            localStorage.setItem("score",JSON.stringify(score))
            function getResult(move){
                game.ComputerMove = getMove(getNum());
                game.playerMove = move
                console.log(JSON.stringify(game))
                
                console.log(JSON.stringify(score))

                let result = "None";
                if(game.playerMove ==="Rock"){
                    result = ifRock()
                } else if(game.playerMove ==="Paper"){
                    result = ifPaper()
                }else{
                    result = ifScissor()
                }

                updateScore(result)
                
                
            };
            
            function updateScore(result){
                document.querySelector('.js-score')
                .innerHTML = `Wins🏆: ${score.Wins} | Loses❌: ${score.Loses} | Draws🟰: ${score.Draws}` 

                document.querySelector('.js-user-moves')
                .innerHTML = `Your move:<br> ${getImage(game.playerMove)} </br>`
                
                document.querySelector('.js-computer-moves').innerHTML = 
                ` Computer's move: <br>${getImage(game.ComputerMove)}</br>`

                if(!result){
                    result = "You haven't played a game yet!"
                }
                document.getElementById('js-result')
                .innerHTML = result
            }
            
            

            function getNum(){
                const randomNumber = Math.random();
                console.log(randomNumber);
                return randomNumber;
            };

            function getMove(num){
                if(num < 0.33){
                    return "Rock";
                };
                
                if(num < 0.63){
                    return "Paper";
                }else{
                    return "Scissor";
                };
            };

            function ifRock(){

                if (game.ComputerMove == 'Rock' ){
                    score.Draws+=1;
                    localStorage.setItem("score", JSON.stringify(score));
                    return "Its a Draw!"

                }
                
                if (game.ComputerMove == 'Paper' ){
                    score.Loses+=1;
                    localStorage.setItem("score", JSON.stringify(score));
                    return "You Lost!"

                }
                
                if (game.ComputerMove == 'Scissor'){
                    score.Wins+=1;
                    localStorage.setItem("score", JSON.stringify(score));
                    return "You won!"
                }

                
            }

            function ifPaper(){

                if (game.ComputerMove == 'Rock' ){
                    score.Wins+=1;
                    localStorage.setItem("score", JSON.stringify(score));
                    return "You won!"
                }
                
                if (game.ComputerMove == 'Paper' ){
                    score.Draws+=1;
                    localStorage.setItem("score", JSON.stringify(score));
                    return "Its a Draw!"
                }
                
                if (game.ComputerMove == 'Scissor'){
                    score.Loses+=1;
                    localStorage.setItem("score", JSON.stringify(score));
                    return "You Lost!"
                }

                
            }
            function ifScissor(){

                if (game.ComputerMove == 'Rock' ){
                    score.Loses+=1;
                    localStorage.setItem("score", JSON.stringify(score));
                    return "You Lost!"
                }
                
                if (game.ComputerMove == 'Paper' ){
                    score.Wins+=1;
                    localStorage.setItem("score", JSON.stringify(score));
                    return "You won!"
                }
                
                if (game.ComputerMove == 'Scissor'){
                    score.Draws+=1;
                    localStorage.setItem("score", JSON.stringify(score));
                    return "Its a Draw!"
                }

                
            }
        
            function resetScore(){
                score.Draws = 0
                score.Loses = 0
                score.Wins = 0
                game.ComputerMove = "None"
                game.playerMove = "None"
                localStorage.setItem("score", JSON.stringify(score));
                updateScore();
            }

            function getImage(result){
                if(result === "Rock"){
                    return `<img src = "images/rock.png" class = "move-emoji">`
                }
                   
            
                if(result === "Paper"){
                    return `<img src="images/paper.png" class= "move-emoji">`
                }

                if(result === "Scissor"){
                    return `<img src = "images/scissors.png" class = "move-emoji">`
                }

                if (result === "None"){
                    return "None"
                }
            }
