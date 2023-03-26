#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <conio.h>
//#include <unistd.h>
//char map[9][15];


char player='P';
int x=4,y=7,healthpoint=3,point=0;
int p=9,l=15;	
char map[9][15]={{"###############"},
		 {"#%%%%%%%%%%%%%#"},
		 {"#%###%###%###%#"},
	 	 {"#%###%# #%###%#"},
		 {"#%%%%% P %%%%%#"},
		 {"#%###%###%###%#"},
		 {"#%###%###%###%#"},
		 {"#%%%%%%%%%%%%%#"},
		 {"###############"}};	
//void generateMap(){
//
//	map[9][15]={{"###############"},
//		 {"#%%%%%%%%%%%%%#"},
//		 {"#%###%###%###%#"},
//	 	 {"#%###%# #%###%#"},
//		 {"#%%%%% P %%%%%#"},
//		 {"#%###%###%###%#"},
//		 {"#%###%###%###%#"},
//		 {"#%%%%%%%%%%%%%#"},
//		 {"###############"}};
//
//	map[x][y]=player;
//	
//	
//}
void displayMap(){
	system("cls");
	int i,j;
	if(map[x-1][y]!='@'|| map[x+1][y]!='@' || map[x][y-1]!= '@'|| map[x][y+1]!='@') map[x][y]=player;
	
	for(i=0;i<p;i++){
		for(j=0;j<l;j++){
			printf("%c",map[i][j]);
		}
		printf("\n");
	}printf("\n\n");
			printf("Current Health Point: %d\n",healthpoint);
			printf("Current Point: %d\n",point);
			printf("P -> Player\n");
			printf("%% -> Brick\n");
			printf("* -> Fire Power Up\n");
			printf("L -> Door\n");
			printf("Arrow Up -> Move Up\n");
			printf("Arrow Left -> Move Left\n");
			printf("Arrow Right -> Move Right\n");
			printf("Arrow Down -> Move Down\n");
			printf("B -> To place bomb\n");
}
void moveUp(){
	if(x-1>0 && map[x-1][y]!='#'){
	if(map[x-1][y]=='%'){
		point+=10;
	}
	map[x][y]=' ';
	x--;
	

	}	
}
void moveDown(){
	if(x+1<p-1 && map[x+1][y]!='#'){
	if(map[x+1][y]=='%'){
		point+=10;
	}
	map[x][y]=' ';
	x++;
	}

}
void moveLeft(){
	if(y-1>0 && map[x][y-1]!='#'){
	if(map[x][y-1]=='%'){
		point+=10;
	}
		map[x][y]=' ';
		y--;
	}

	
}
void moveRight(){
	if(y+1<l-1 && map[x][y+1]!='#'){
	if(map[x][y+1]=='%'){
		point+=10;
	}
	map[x][y]=' ';
	y++;
	}

}

//void bomb(timebomb){
//	map[x][y]='@';
//	int q=x,r=y;
//	if(timebomb==3){
//		if(map[q-1][r]=='%'){
//			map[q-1][r]=' ';
//			point+=10;
//		}
//		if(map[q+1][r]=='%'){
//			map[q+1][r]=' ';
//			point+=10;
//		}
//		if(map[q][r-1]=='%'){
//			map[q][r-1]=' ';
//			point+=10;
//		}
//		if(map[q][r+1]=='%'){
//			map[q][r+1]=' ';
//			point+=10;
//		}
//		timebomb=0;
//	}
//}

int main(){
	FILE*Score;
	int choose;
	char again='Y';
	do{
		system("cls");
		printf("1. Play Game\n2. Leaderboard\n3. Exit\n");
		printf("Choose: "); scanf("%d",&choose);
		switch(choose){
		int timebomb=0;
		char username[50];
		
			case 1:{
			printf("Masukkan Username: "); scanf(" %[^\n]",username);
			system("pause");
			
			do{
//				timebomb++;
				displayMap(map);
//				fflush(stdin);
				char move=getch();
					switch(move){
					case 72:
						moveUp();
						break;
					case 75:
						moveLeft();
						break;
					case 77:
						moveRight();
						break;
					case 80:
						moveDown();
						break;
//					case 'b':
//						bomb(timebomb);
					case 27:

						printf("Continue [Y/N]: "); scanf(" %c",&again);
						break;

						
				}
				
			}while(healthpoint!=0 && again!='N');
			Score=fopen("score.txt","a+");
			fprintf(Score,"%s;%d\n",username,point);
			fclose(Score);				
				break;
			}


			
			case 2:{
				Score=fopen("score.txt","r");
//				printf("ggg");
				int jumlahplayer=0;
				char usernames[100][99];
				int points[100];
				while(!feof(Score)){
					fscanf(Score,"%[^;];%d\n",usernames[jumlahplayer],&points[jumlahplayer]);
					jumlahplayer++;

				}
				printf("ggg");
				int i,j;
				for(i=0;i<jumlahplayer;i++){
					for(j=jumlahplayer-1;j>i;j--){
						if(points[j-1]<points[j]){
							int tukar=points[j];
							points[j]=points[j-1];
							points[j-1]=tukar;
							
							char tukarr[100];
							strcpy(tukarr,usernames[j]);
							strcpy(usernames[j],usernames[j-1]);
							strcpy(usernames[j-1],tukarr);
						}
					}
				}
				char user[]="Username";
				char rank[]="Rank";
				char score[]="Score";
				
				printf("Leader Board\n");
				printf("========================================\n");
				printf("| %-4s | %-21s | %-5s |\n",rank,user,score);
				printf("========================================\n");
				for(i=0;i<jumlahplayer;i++){
					printf("| %4d | %21s | %5d |\n",i+1,usernames[i],points[i]);
				}
				printf("========================================\n");
				system("pause");			
				break;
			}

			case 3:
				break;
				
				
		}
	}while(choose!=3 && again!='N');
	printf("Thank you for playing\n");

	return 0;
}


