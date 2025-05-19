import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";
import { CreateEventDto } from "../dto/create-event.dto";
import { Event, Reward, Request, RequestStatus, EventStatus, User, EventType, UserInfo } from "common";
import { CreateRewardDto } from "src/dto/create-reward.dto";
import { CreateRequestDto } from "src/dto/create-request.dto";

@Injectable()
export class EventService {
    constructor(
        @InjectModel(Event.name) private readonly eventModel: Model<Event>,
        @InjectModel(Reward.name) private readonly rewardModel: Model<Reward>,
        @InjectModel(Request.name) private readonly requestModel: Model<Request>,
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(UserInfo.name) private readonly userInfoModel: Model<UserInfo>
    ) {}

    async createEvent(createEventDto: CreateEventDto): Promise<Event> {
        const event = await this.eventModel.create(createEventDto);
        return event;
    }
    
    async getEvents(): Promise<Event[]> {
        const events = await this.eventModel.find().select('title _id');
        return events;
    }

    async getEventById(id: string): Promise<Event> {
        if (!isValidObjectId(id)) {
            throw new BadRequestException('유효하지 않은 요청ID 입니다.');
        }
        const event = await this.eventModel.findById(id).populate('rewards');
        if (!event) {
            throw new NotFoundException('존재하지 않는 이벤트입니다.');
        }
        return event;
    }

    async createReward(createRewardDto: CreateRewardDto): Promise<Reward> {
        const event = await this.eventModel.findById(createRewardDto.event);
        if (!event) {
            throw new NotFoundException("존재하지 않는 이벤트입니다.");
        }

        const reward = await this.rewardModel.create(createRewardDto);

        event.rewards.push(reward._id);
        await event.save();

        return reward;
    }

    async createRequest(createRequestDto: CreateRequestDto, userId: string) {
        const { eventId, couponCode = null } = createRequestDto;

        const event = await this.eventModel.findById(eventId);
        if (!event || event.status !== EventStatus.ACTIVE) {
            throw new NotFoundException("존재하지 않는 이벤트입니다.");
        }

        const successRequest = await this.requestModel.findOne({
            event: eventId,
            user: userId,
            status: RequestStatus.SUCCESS
        });

        if (successRequest) {
            throw new BadRequestException("이미 보상을 받은 이벤트입니다.");
        }
        

        const request = await this.requestModel.create({
            event: eventId,
            user: userId,
            status: RequestStatus.PENDING
        });
        
        const user = await this.userModel.findById(userId).populate<{ userInfo: UserInfo }>('userInfo');
        if (!user) {
            throw new NotFoundException("존재하지 않는 유저입니다.");
        } //무조건 있긴 할텐데 없으면 오류 발생

        user.requests.push(request._id);
        await user.save();

        

        const requestStatus = await this.checkCondition(event, user.userInfo, couponCode);

        request.status = requestStatus;
        await request.save();

        return request;    
    }

    private async checkCondition(event: Event, userInfo: UserInfo, couponCode: string | null): Promise<RequestStatus> {
        const { startDate, endDate, condition, type } = event;

        if (Date.now() < startDate.getTime() || Date.now() > endDate.getTime()) {
            return RequestStatus.REJECT_DATE;
        }

        

        if (type === EventType.COUPON) {
            if (!couponCode) {
                return RequestStatus.REJECT_CONDITION;
            }
            if(condition === couponCode) {
                return RequestStatus.SUCCESS;
            }
        } 
        else {
            if (type === EventType.ATTENDANCE) {
                if (userInfo.attendanceStreak >= parseInt(condition)) {
                    return RequestStatus.SUCCESS;
                }
                else {
                    return RequestStatus.REJECT_CONDITION;
                }
            }

            else if (type === EventType.AGE) {
                const birthDate = userInfo.birthDate;
                const today = new Date();
                
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
    
                if (age <= parseInt(condition)) {
                    return RequestStatus.SUCCESS;
                }
                else {
                    return RequestStatus.REJECT_CONDITION;
                }
            }
          
        }
        
        return RequestStatus.REJECT_STATUS;
       
    }

    async getRequests(userId?: string): Promise<Request[]> {
        if (userId) {
            const user = await this.userModel.findById(userId).populate<{ requests: Request[] }>('requests');
            if (!user) {
                throw new NotFoundException("존재하지 않는 유저입니다.");
            }
            return user.requests;
        }
        else {
            return this.requestModel.find();
        }
    }
}