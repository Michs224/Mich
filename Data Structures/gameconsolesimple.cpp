#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <windows.h>
//#include <conio.h>
//My own console game rules


int main(){
	char gamepage[9][16]={{"###############"},
							{"#%%%%%%%%%%%%%#"},
							{"#%###%###%###%#"},
							{"#%###%# #%###%#"},
							{"#%%%%% P %%%%%#"},
							{"#%###%###%###%#"},
							{"#%###%###%###%#"},
							{"#%%%%%%%%%%%%%#"},
							{"###############"}};
//	for(int i=0;i<9;i++){
//		for(int j=0;j<15;j++){
//			printf("%c",gamepage[i][j]);
//		}
//		printf("\n");
//	}
	int x;	
	printf("1. Play Game\n2. Leaderboard\n3. Exit\n");
	printf("Choose: "); scanf("%d",&x);
	switch(x){	

		case 1:	

			{		char username[100];
			int health=3,point=0;
									

			
			char again='Y';	
			do{
		
			
			printf("Enter your username: "); scanf(" %[^\n]",username); fflush(stdin);
//			jumlahpemain++;
//			system("pause");
			printf("Press enter to play..."); int k=getchar();
//			char gamepage[9][16]={{"###############"},
//									{"#%%%%%%%%%%%%%#"},
//									{"#%###%###%###%#"},
//									{"#%###%# #%###%#"},
//									{"#%%%%% P %%%%%#"},
//									{"#%###%###%###%#"},
//									{"#%###%###%###%#"},
//									{"#%%%%%%%%%%%%%#"},
//									{"###############"}};
			int end=1;
			while(1){
				system("cls");
							for(int i=0;i<9;i++){
				for(int j=0;j<15;j++){
				printf("%c",gamepage[i][j]);
			}
			printf("\n");
			}
			printf("Current Health Point: %d\n",health);
			printf("Current Point: %d\n",point);
			printf("P -> Player\n");
			printf("% -> Brick\n");
			printf("* -> Fire Power Up\n");
			printf("L -> Door\n");
			printf("Arrow Up -> Move Up\n");
			printf("Arrow Left -> Move Left\n");
			printf("Arrow Right -> Move Right\n");
			printf("Arrow Down -> Move Down\n");
			printf("B -> To place bomb\n");
			fflush(stdin);
			scanf("%d",&end);
//			int end=getchar();
//			if(c==0){
//				end=0;
//			}
			if(end==0){
				printf("Continue? [Y/N]");scanf(" %c",&again);
				if(again=='Y') end=1;
				

			}
			Sleep(500);
				system("cls");
			}
			
			
			}while(again!='N');
			
			printf("Game Over\n");
			printf("%s finished with %d points!\n",username,point);
			printf("Wonderful things can be achieved when there's teamwork, hard work, and perseverance! <3\n");
			fflush(stdin);printf("Press enter to continue..."); int c=getchar();
			FILE*score=fopen("score.txt","a+");
			fprintf(score,"%s;%d\n",username,point);
			fclose(score);
			break;
			}
	
			
		case 2:
		{	int point[100];
			char username[100],tukarr[100];
			char rank[]="Rank";
			char user[]="Username";
			char scorr[]="Score";
				FILE*score=fopen("score.txt","r");
				int jumlahpemain=0;
				while(!feof(score)){
				fscanf(score,"%s;%d\n",username[jumlahpemain],&point[jumlahpemain]);
				jumlahpemain++;
				}
		
				fclose(score);
			for(int i=0;i<jumlahpemain;i++){
				for(int j=jumlahpemain-1;j>i;j--){
					if(point[j-1]<point[j]){
						int tukar=point[j];
						point[j]=point[j-1];
						point[j-1]=tukar;
//						char tukarr[100];
						strcpy(tukarr,&username[j]);
						strcpy(&username[j],&username[j-1]);
						strcpy(&username[j-1],tukarr);
					}
				}
			}
			printf("====================================\n");
			printf("| %-4s | %-15s | %-5s |\n",rank,user,scorr);
			printf("====================================\n");
			for(int i=0;i<jumlahpemain;i++){
				printf("| %4d | %15s | %5d |\n",i+1,username[i],point[i]);
			}
			printf("====================================\n");
			fflush(stdin);printf("Press enter to continue..."); int c=getchar();
			break;
		}
	
		
			
			
			
		default:
			printf("Invalid Input!\n");
			printf("Press enter to continue..."); getchar();
			break;
			
			
	}
//	labelend:
	printf("Exit...\n");
		return 0;
}
